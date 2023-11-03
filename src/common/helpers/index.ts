import { BlockTag } from "@ethersproject/abstract-provider";

import Cache from "../../config/cache";
import { DEFAULT_STARTING_BLOCK_NO } from "../types/constants";
import redisClient from '../helpers/redis.helpers';

/**
 * Fetch the latest scraped block Number from Redis or return default if it's none.
 */
export const getLatestScrapedBlockNo = async (): Promise<number> => {
    const latestBlock = await Cache.get('LATEST_BLOCK_NO');
    return latestBlock ? Number(latestBlock) : DEFAULT_STARTING_BLOCK_NO;
}

/**
 * Fetch the latest scraped block Number from Redis or return default if it's none.
 */
export const isBlockRangeFailed = async (startBlock?: BlockTag, endBlock?: BlockTag): Promise<boolean> => {
  // ensure it falls in the required range
  const failedBlocks = await redisClient.find('field');
  const blockRange =  `${startBlock}-${endBlock}`;
  return failedBlocks.some((block: string)=> block === blockRange);
}

/**
 * Convert an object into the Redis Parameters Format { a:'b', c:'d' } to ['a','b','c','d']
 */
export const convertObjectToRedisArrayParameters = (obj: {[key: string]: string}): Array<string> => {
    const keys = Object.keys(obj);
    const parameters: Array<string> = [];
    for (const key of keys) {
      parameters.push(key);
      parameters.push(String(obj[key]));
    }
    return parameters;
};

/**
 * Convert the Redis Parameters Format into Js object ['a','b','c','d'] to { a:'b', c:'d' }
 */
export const convertRedisArrayParametersToObject = (arr: Array<string>) => {
    const obj: { [key: string]: string } = {};
    for (let index = 0; index < arr.length; ) {
      obj[arr[index]] = arr[index + 1];
      index += 2;
    }
    return obj;
  };