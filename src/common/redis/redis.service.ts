import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('NEST_REDIS')
  private client: RedisClientType

  getClient(): RedisClientType {
    return this.client
  }

  async get(redisKey: string): Promise<string> {
    return await this.client.get(redisKey)
  }

  async set(redisKey: string, value: string | number, seconds?: number): Promise<string> {
    const options =  seconds ? { EX: seconds } : {}
    return await this.client.set(redisKey, value, options)
  }
  async hSet(redisKey: string, value: Record<string, string | number | boolean | Date>): Promise<number> {
    const newValue = Object.entries(value).flat().map(item => String(item))
    return await this.client.hSet(redisKey, newValue)
  }

  // 获取哈希所有字段和值
  async hGetAll(redisKey: string): Promise<Record<string, string>> {
    if (!redisKey) return null
    return await this.client.hGetAll(redisKey)
  }

  async del(redisKey: string): Promise<number> {
    return await this.client.del(redisKey)
  }

  
}