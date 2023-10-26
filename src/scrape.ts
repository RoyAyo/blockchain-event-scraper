import process from "process";

import { loadLatestBlock } from "./helpers/contract.helpers"
import { loadFeeCollectorQueue } from "./utils/queue";
import { getLatestScrapedBlockNo } from "./helpers/index";
import redisClient from './helpers/cache.helpers';

import { BLOCK_SCRAPE_RANGE } from "./types/constants";
import { JobCounts } from "bull"; 
import { BlockTag } from "@ethersproject/abstract-provider";

async function isBlockRangeFailed(startBlock?: BlockTag, endBlock?: BlockTag): Promise<boolean> {
    // ensure it falls in the required range
    const failedBlocks = await redisClient.find('field');
    const blockRange =  `${startBlock}-${endBlock}`;
    return failedBlocks.some((block: string)=> block === blockRange);
}

export const scrapeData = async (startBlock?: BlockTag, endBlock?: BlockTag) => {
    try {
        
        if(startBlock || endBlock) {
            if(! (await isBlockRangeFailed(startBlock, endBlock))) {
                throw new Error('You cannot retry this block');
            }
        }

        const latestScrapedBlock = await getLatestScrapedBlockNo();
        let fromBlock = Number(startBlock) ?? latestScrapedBlock + 1; // fetch from the stack in the database
        const maxBlockNo = Number(endBlock) ??  await loadLatestBlock();

        while(fromBlock < maxBlockNo) {
            let toBlock = fromBlock + BLOCK_SCRAPE_RANGE - 1; // e.g range of 0-999, 1000-1999...
            
            // save query from requesting excess blocks.
            if(toBlock > maxBlockNo) {
                toBlock = maxBlockNo;
            }

            // add current block to Queue
            loadFeeCollectorQueue.add({
                maxBlockNo,
                fromBlock,
                toBlock
            }, {jobId: `${fromBlock}-${toBlock}`}); 
            // set jobid to the unique range, so it avoids deduplication.
            
            fromBlock += BLOCK_SCRAPE_RANGE;
        }

        setTimeout(async () => {
            const jobs: JobCounts = await loadFeeCollectorQueue.getJobCounts()
            
            if(jobs.active <= 0) {
                process.exit()
            }
        }, 5000)


    } catch (error) {
        console.error('error', error);
    }
}

// call function once the server is started
const startBlock = process.argv[2]
const endBlock = process.argv[3]
scrapeData(startBlock, endBlock);