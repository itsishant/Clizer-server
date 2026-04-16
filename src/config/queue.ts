import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { env } from './env';

let redisConnection: IORedis | null = null;
let processingQueue: Queue | null = null;

if (env.REDIS_URL) {
  redisConnection = new IORedis(env.REDIS_URL, { 
    lazyConnect: true,
    retryStrategy: () => null,
    maxRetriesPerRequest: null 
  });
  processingQueue = new Queue('processing-jobs', { connection: redisConnection });
}

export { redisConnection, processingQueue };
