// redis.module.ts
import { Global, Module } from '@nestjs/common';
import { createClient } from 'redis';
import { RedisService } from './redis.service';

const createRedisClient = async() => {
  return await createClient({
    socket: {
      host: 'localhost',
      port: 6379,
    }
  }).connect();
};

@Global()
@Module({
  providers: [
    {
      provide: 'NEST_REDIS',
      useFactory: createRedisClient,
    },
    RedisService
  ],
  exports: ['NEST_REDIS', RedisService],
})
export class RedisModule {}
