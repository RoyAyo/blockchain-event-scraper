import Queue from "bull";

import { QUEUE_FAILED_RETRY, QUEUE_NAME } from "../common/types/constants";
import { loadFeeCollectorHandler } from "../common/modules/events/events.handler";

export const loadFeeCollectorQueue = new Queue(QUEUE_NAME, {
  redis: {
    host: process.env.REDIS_HOST || "127.0.0.1",
  },
  defaultJobOptions: {
    attempts: QUEUE_FAILED_RETRY,
    removeOnFail: true,
  },
});

loadFeeCollectorQueue.process(loadFeeCollectorHandler);
