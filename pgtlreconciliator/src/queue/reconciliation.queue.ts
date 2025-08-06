// reconciliation.queue.ts
import { Queue } from 'bullmq';
import { redisConfig } from '../redis.config'; // your Redis connection

export const reconciliationQueue = new Queue('reconciliation', {
  connection: redisConfig,
});
