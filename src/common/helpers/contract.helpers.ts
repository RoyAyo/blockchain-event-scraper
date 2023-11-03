import { BigNumber, ethers, utils } from "ethers";
import { BlockTag } from "@ethersproject/abstract-provider";

import { _abi } from "../types/abi";
import { CONTRACT_ADDRESS, POLYGON_RPC } from "../types/constants";

export interface ParsedFeeCollectedEvents {
  txnHash: string; // the unique transaction hash
  blockNo: number; // the block of the event
  token: string; // the address of the token that was collected
  integrator: string; // the integrator that triggered the fee collection
  integratorFee: string; // the share collector for the integrator
  lifiFee: string; // the share collected for lifi
}

/**
 * Load and return the latest block no
 */
export const loadLatestBlock = async (): Promise<number> => {
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    new utils.Interface(_abi),
    new ethers.providers.JsonRpcProvider(POLYGON_RPC),
  );
  const latestBlockNo = await contract.provider.getBlockNumber();
  return latestBlockNo;
};

/**
 * For a given block range all `FeesCollected` events are loaded from the Polygon FeeCollector
 * @param fromBlock
 * @param toBlock
 */
export const loadFeeCollectorEvents = (
  fromBlock: BlockTag,
  toBlock: BlockTag,
): Promise<ethers.Event[]> | [] => {
  const feeCollector = new ethers.Contract(
    CONTRACT_ADDRESS,
    _abi,
    new ethers.providers.JsonRpcProvider(POLYGON_RPC),
  );
  const filter = feeCollector.filters.FeesCollected();
  return feeCollector.queryFilter(filter, fromBlock, toBlock);
};

/**
 * Takes a list of raw events and parses them into ParsedFeeCollectedEvents
 * @param events
 */
export const parseFeeCollectorEvents = (
  events: ethers.Event[],
): ParsedFeeCollectedEvents[] => {
  const feeCollectorContract = new ethers.Contract(
    CONTRACT_ADDRESS,
    new utils.Interface(_abi),
    new ethers.providers.JsonRpcProvider(POLYGON_RPC),
  );

  return events.map((event) => {
    const parsedEvent = feeCollectorContract.interface.parseLog(event);

    const feesCollected: ParsedFeeCollectedEvents = {
      txnHash: event.transactionHash,
      blockNo: event.blockNumber,
      token: parsedEvent.args[0],
      integrator: parsedEvent.args[1],
      integratorFee: BigNumber.from(parsedEvent.args[2]).toHexString(),
      lifiFee: BigNumber.from(parsedEvent.args[3]).toHexString(),
    };
    return feesCollected;
  });
};
