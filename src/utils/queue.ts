import Queue, { DoneCallback, Job } from 'bull'
import { ParsedFeeCollectedEvents, loadFeeCollectorEvents, parseFeeCollectorEvents } from '../helpers/contract.helpers';
import Event from '../modules/events/events.model';
import { convertRedisArrayParametersToObject } from '../helpers/index';
import Cache from '../config/cache';

import { startSession } from 'mongoose';
import { QUEUE_FAILED_RETRY, QUEUE_NAME } from '../types/constants';
import RedisClient from '../helpers/cache.helpers';

export const loadFeeCollectorQueue = new Queue(QUEUE_NAME, {
    defaultJobOptions: {
        attempts: QUEUE_FAILED_RETRY,
        removeOnFail: true,
    }
});
loadFeeCollectorQueue.process(async (job: Job, done: DoneCallback) => {
    const {
        maxBlockNo,
        fromBlock,
        toBlock
    } = job.data;

    try {
        const events = await loadFeeCollectorEvents(fromBlock, toBlock);
        const parsedEvents = parseFeeCollectorEvents(events);
        await RedisClient.addEventsToStream(parsedEvents, fromBlock, toBlock);
        console.log(`Scraped from Block ${fromBlock} -> ${toBlock}`);
        
        if(toBlock >= maxBlockNo) {
            console.log('Finished processing block');
            loadFeeCollectorQueue.emit('finished');
        }
        done();

    } catch (error: unknown) {
        // to ensure the job gets retried, do not call done.
        console.error(`Error processing block ${fromBlock} -> ${toBlock} on attempt ${job.attemptsMade}`);
        if(job.attemptsMade >= (QUEUE_FAILED_RETRY - 1)) {
            // to know what block range to retry
            RedisClient.push('failed', `${fromBlock}-${toBlock}`);
            console.error(`Job Failed due to ${error} => Retry from: ${fromBlock}: to: ${toBlock}`);
            job.remove();
        }
        done(error as Error);
    }
})

loadFeeCollectorQueue.on('finished', async () => {

    const session = await startSession();
    session.startTransaction();

    try {
        const records = await RedisClient.fetchEventsFromStream();
        const allEvents: ParsedFeeCollectedEvents[] = []

        let maxValue = 0;
        const eventHash = new Set();

        for (const record of records) {
            const convertedRecord = convertRedisArrayParametersToObject(record[1]);
            const eventId = record[0]
            const events: ParsedFeeCollectedEvents[] = JSON.parse(convertedRecord.events);
            const toBlock = Number(convertedRecord.toBlock);
            // in case of retries, do not replace the LATEST BLOCK NO
            maxValue = Math.max(maxValue, toBlock);
            for(const event of events) {
                // add Txn hash to a set during computation and delete if dedeuplication occurs
                if(eventHash.has(event.txnHash)) {
                    await RedisClient.deleteDuplicateFromStream(eventId);
                } else {
                    eventHash.add(event.txnHash)
                    allEvents.push(event)
                }
            }
        }
        
        await Cache.set('LATEST_BLOCK_NO', maxValue);

        // clear the secondary database(Mongo-db) and replace with event stream data
        await Event.deleteMany();
        await Event.insertMany(allEvents);
        session.commitTransaction();

        console.log('DATABASE UPDATED');
        console.log('OPERATION COMPLETED');

    } catch (error) {
        session.abortTransaction()
        console.error('Error during Queue Finish =>', error);
    } finally {
        session.endSession();
        process.exit();
    }
})