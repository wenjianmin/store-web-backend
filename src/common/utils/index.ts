import { RedisKeyPrefix } from "../enums/redis-key.enum";

export function getRedisKey(moduleKey: RedisKeyPrefix, id: number | string): string {
  return `${moduleKey}${id}`
}