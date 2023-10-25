import { loadContractAndLatestBlock } from "./helpers/contract.helpers"
import { loadFeeCollectorQueue } from "./config/queue";
import { getLatestScrapedBlockNo } from "./helpers/index";

// const MIN_TIME_TO_ADD_A_BLOCK = 14 // IN SECONDS
import './config/database';


export const scrapeData = async (startBlock?: number, endBlock?: number) => {
    try {
    let fromBlock = startBlock ?? (await getLatestScrapedBlockNo()) + 1; // fetch from the stack in the database

    const maxBlockNo = endBlock ?? (await loadContractAndLatestBlock());

    while(fromBlock < maxBlockNo) {
        let toBlock = fromBlock + 999; // e.g range of 0-999, 1000-1999...
        
        // save query from requesting excess blocks.
        if(toBlock > maxBlockNo) {
            toBlock = maxBlockNo;
        }

        // add current block to Queue
        loadFeeCollectorQueue.add({
            maxBlockNo,
            fromBlock,
            toBlock
        }, {jobId: `${fromBlock}-${toBlock}`})
        
        fromBlock += 1000;
    }

    } catch (error) {
        console.error('error', Error);    
    }
}

scrapeData();