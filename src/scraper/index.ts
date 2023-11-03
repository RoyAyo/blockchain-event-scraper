import process from "process";
import { BlockTag } from "@ethersproject/abstract-provider";
import { JobCounts } from "bull";
import dotenv from "dotenv";

import "../config/database";
import { loadLatestBlock } from "../common/helpers/contract.helpers";
import { loadFeeCollectorQueue } from "../config/queue";
import { BLOCK_SCRAPE_RANGE } from "../common/types/constants";
import {
  getLatestScrapedBlockNo,
  isBlockRangeFailed,
} from "../common/helpers/index";

dotenv.config();

export const scrapeData = async (
  startBlock?: BlockTag,
  endBlock?: BlockTag,
) => {
  try {
    if (startBlock || endBlock) {
      if (!(await isBlockRangeFailed(startBlock, endBlock))) {
        throw new Error("You cannot retry this block");
      }
    }

    const latestScrapedBlock = await getLatestScrapedBlockNo();
    let fromBlock = startBlock ? Number(startBlock) : latestScrapedBlock + 1; // fetch from the stack in the database
    const maxBlockNo = endBlock ? Number(endBlock) : await loadLatestBlock();

    while (fromBlock < maxBlockNo) {
      let toBlock = fromBlock + BLOCK_SCRAPE_RANGE - 1; // e.g range of 0-999, 1000-1999...

      // save query from requesting excess blocks.
      if (toBlock > maxBlockNo) {
        toBlock = maxBlockNo;
      }
      // add current block to Queue and set jobid to the unique range, so it avoids deduplication.
      loadFeeCollectorQueue.add(
        {
          maxBlockNo,
          fromBlock,
          toBlock,
        },
        { jobId: `${fromBlock}-${toBlock}` },
      );

      fromBlock += BLOCK_SCRAPE_RANGE;
    }

    setTimeout(async () => {
      const jobs: JobCounts = await loadFeeCollectorQueue.getJobCounts();

      if (jobs.active <= 0) {
        process.exit();
      }
    }, 5000);
  } catch (error) {
    console.error("error", error);
  }
};

// call function once the server is started
const startBlock = process.argv[2];
const endBlock = process.argv[3];

loadFeeCollectorQueue
  .isReady()
  .then(() => {
    if (loadFeeCollectorQueue.client.status === "ready") {
      scrapeData(startBlock, endBlock);
    } else {
      throw new Error("Cache is not connecting");
    }
  })
  .catch((e) => {
    console.error(e);
    process.exit();
  });
