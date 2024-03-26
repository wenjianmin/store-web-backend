import { Module } from '@nestjs/common';
import { Logger } from './logger';

@Module({
  providers: [Logger],
  // 导出Logger给其他模块共享
  exports: [Logger]
})
export class LoggerModule {}
