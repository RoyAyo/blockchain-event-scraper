import Queue, { DoneCallback, Job } from 'bull'
import { ethers } from 'ethers';
import { loadFeeCollectorEvents, parseFeeCollectorEvents } from '../helpers/contract.helpers';
import Event from '../modules/events/events.model';
import { convertObjectToRedisArrayParameters, convertRedisArrayParametersToObject } from '../helpers/index';
import Cache from './cache';

export const loadFeeCollectorQueue = new Queue('load fees 1', {
    defaultJobOptions: {
        attempts: 4,
        removeOnFail: true,
    }
});
loadFeeCollectorQueue.process(async (job: Job, done: DoneCallback) => {
    const {
        maxBlockNo,
        fromBlock,
        toBlock
    } = job.data;

    console.log('job => ', job.id);

    try {
        const events = await loadFeeCollectorEvents(fromBlock, toBlock);
        const parsedEvents = parseFeeCollectorEvents(events);
        const parameters = convertObjectToRedisArrayParameters({
            fromBlock,
            toBlock,
            events: JSON.stringify(parsedEvents),
        });

        await Cache.sendCommand(["XADD", "event_stream", "*", ...parameters]);
        done();

        if(toBlock >= maxBlockNo) {
            loadFeeCollectorQueue.emit('finished');
            console.log('Job finished')
        }

    } catch (error: unknown) {
        // to ensure the job gets retried, do not call done.
        console.log('jobs', job.attemptsMade)
        if(job.attemptsMade >= 3) {
            console.error(`Job Failed due to ${error} => Retry from: ${fromBlock}: to: ${toBlock}`);
            const failedBlocksData = await Cache.hGet('failed', 'blocks');
            if(failedBlocksData) {
                const failedBlocks: string[] = JSON.parse(failedBlocksData);
                failedBlocks.push(`${fromBlock}-${toBlock}`)
                await Cache.hSet('failed', 'blocks', JSON.stringify(failedBlocks));
            } else {
                await Cache.hSet('failed', 'blocks', JSON.stringify([`${fromBlock}-${toBlock}`]));
            }
        }
        done(error as Error);
    }
})

loadFeeCollectorQueue.on('finished', async () => {

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = await Cache.sendCommand([
            "XREAD",
            "STREAMS",
            "event_stream",
            "0-0",
        ]);

        let allEvents: ethers.Event[] = []

        if (data) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [_, records] = data[0];

            let maxValue = 0;

            for (const record of records) {
                const convertedRecord = convertRedisArrayParametersToObject(record[1]);
                const events = JSON.parse(convertedRecord.events);
                const toBlock = Number(convertedRecord.toBlock);
                // in case of retries, do not replace the LATEST BLOCK NO
                maxValue = Math.max(maxValue, toBlock);
                allEvents = [...events, ...allEvents];
            }

            // clear the secondary database and replace with event stream
            await Event.deleteMany();
            await Event.insertMany(allEvents);

            // insert updated data
            await Cache.set('LATEST_BLOCK_NO', maxValue);
        }
    
    } catch (error) {
        console.error(error);   
    }
})