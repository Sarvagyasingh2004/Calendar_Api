import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import type { RedisReply } from "rate-limit-redis";
import { redisClient } from "../config/redis";
import { logger } from "../utils/logger";

export const sensitiveEndpointsLimiter = (
  maxRequests: number,
  time: number,
) => {
  return rateLimit({
    max: maxRequests,
    windowMs: time,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn(`Sensitive endpoint rate limit exceeded for IP: ${req.ip}`);
      res.status(429).json({
        success: false,
        message: "Too many requests",
      });
    },
    store: new RedisStore({
      sendCommand: (...args: [string, ...string[]]): Promise<RedisReply> => {
        const command = args[0];
        const rest = args.slice(1);

        return redisClient.call(
          command,
          ...(rest as (string | number | Buffer)[]),
        ) as Promise<RedisReply>;
      },
    }),
  });
};
