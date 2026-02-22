import { RateLimiterRedis } from "rate-limiter-flexible";
import { redisClient } from "../config/redis";

export const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "middleware",
  points: 10,
  duration: 1,
});
