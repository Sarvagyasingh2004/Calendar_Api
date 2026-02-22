import { Redis } from "ioredis";
import { logger } from "../utils/logger";

export const redisClient = new Redis(process.env.REDIS_URL!);

redisClient.on("connect", () => {
  logger.info("Redis connected");
});

redisClient.on("error", (err) => {
  logger.info("Redis Error", err);
});
