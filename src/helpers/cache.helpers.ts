/* eslint-disable @typescript-eslint/no-explicit-any */
import { ParsedFeeCollectedEvents } from "./contract.helpers";
import { convertObjectToRedisArrayParameters } from ".";
import Cache from "../config/cache";
import { STREAM_NAME } from "../types/constants";

class RedisClient {

    async push(field: string, value: unknown) {
        const data = await this.find(field);
        data.push(value);
        await Cache.hSet(field, STREAM_NAME , JSON.stringify(data));
    }

    async find(field: string) {
        const data = await Cache.hGet(field, STREAM_NAME);
        if(data) {
            return JSON.parse(data);
        }
        return [];
    }

    async addEventsToStream(events: ParsedFeeCollectedEvents[], fromBlock: string, toBlock: string) {
        const parameters = convertObjectToRedisArrayParameters({
            fromBlock,
            toBlock,
            events: JSON.stringify(events),
        });

        await Cache.sendCommand(["XADD", STREAM_NAME, "*", ...parameters]);
    }

    async fetchEventsFromStream(): Promise<Array<any>> {
        const data: any = await Cache.sendCommand([
            "XREAD",
            "STREAMS",
            STREAM_NAME,
            "0-0",
        ]);

        if(data) {
            const [, records] = data[0];
            return records;
        }
        return [];
    }

    async deleteDuplicateFromStream(id: string) {
        await Cache.sendCommand([
            "XDEL",
            STREAM_NAME,
            id
        ]);
    }
}

export default new RedisClient();