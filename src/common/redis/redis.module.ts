// redis.module.ts
import { Global, Module } from '@nestjs/common';
import { createClient } from 'redis';
import { RedisService } from './redis.service';
import { ConfigService } from '@nestjs/config';

const createRedisClient = async (config: ConfigService) => {
  return await createClient({
    socket: {
      host: config.get<string>('REDIS_HOST'),
      port: config.get<number>('REDIS_PORT'),
    },
  }).connect();
};

@Global()
@Module({
  providers: [
    {
      provide: 'NEST_REDIS',
      inject: [ConfigService],
      useFactory: createRedisClient,
    },
    RedisService,
  ],
  exports: ['NEST_REDIS', RedisService],
})
export class RedisModule {}
