import { redisClient } from "../config/redis";

const DEFAULT_TTL_SECONDS = 60 * 5;

export const getCache = async <T>(key: string): Promise<T | null> => {
  const data = await redisClient.get(key);
  return data ? (JSON.parse(data) as T) : null;
};

export const setCache = async (
  key: string,
  value: unknown,
  ttlSeconds: number = DEFAULT_TTL_SECONDS,
): Promise<void> => {
  await redisClient.setex(key, ttlSeconds, JSON.stringify(value));
};

export const deleteCache = async (key: string): Promise<void> => {
  await redisClient.del(key);
};

export const deleteByPattern = async (pattern: string): Promise<void> => {
  const keys = await redisClient.keys(pattern);
  if (keys.length > 0) {
    await redisClient.del(...keys);
  }
};
