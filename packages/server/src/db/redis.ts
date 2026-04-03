import Redis from "ioredis";
import { Logger } from "@/logger";

const logger = new Logger("Redis");

const redisUrl = process.env.REDIS_URL ?? "redis://localhost:6379";

export const redisClient = new Redis(redisUrl, {
  lazyConnect: true,
  // Don't block requests if Redis is temporarily unavailable
  enableOfflineQueue: false,
  maxRetriesPerRequest: 1,
});

redisClient.on("connect", () => logger.log("Connected to Redis"));
redisClient.on("error", (err: Error) =>
  logger.error(`Redis error: ${err.message}`),
);

// Eagerly connect so errors surface at startup
redisClient.connect().catch((err: Error) => {
  logger.error(`Failed to connect to Redis: ${err.message}`);
});
