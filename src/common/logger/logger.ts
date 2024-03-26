import { Injectable, LoggerService } from '@nestjs/common';
import 'winston-daily-rotate-file';
import {
  Logger as WinstonLogger,
  createLogger,
  format,
  transports,
} from 'winston';
import * as chalk from 'chalk';
import * as dayjs from 'dayjs';

@Injectable()
export class Logger implements LoggerService {
  private logger: WinstonLogger;
  constructor() {
    this.logger = createLogger({
      level: 'debug',
      transports: [
        // 打印到控制台，生产环境可关闭
        new transports.Console({
          format: format.combine(
            // 颜色
            format.colorize(),
            // 日志格式
            format.printf(({ context, level, message, timestamp }) => {
              const appStr = chalk.green(`[NEST]`);
              const contextStr = chalk.yellow(`[${context}]`);

              return `${appStr} ${timestamp} ${level} ${contextStr} ${message} `;
            }),
          ),
        }),
        // 保存到文件
        new transports.DailyRotateFile({
          // 日志文件文件夹
          dirname: process.cwd() + '/src/logs',
          // 日志文件名 %DATE% 会自动设置为当前日期
          filename: 'application-%DATE%.info.log',
          // 日期格式
          datePattern: 'YYYY-MM-DD',
          // 压缩文档，用于定义是否对存档的日志文件进行 gzip 压缩 默认值 false
          zippedArchive: true,
          // 文件最大大小，可以是bytes、kb、mb、gb
          maxSize: '20m',
          // 最大文件数，可以是文件数也可以是天数，天数加单位"d"，
          maxFiles: '7d',
          // 格式定义，同winston
          format: format.combine(
            format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            format.json(),
          ),
          // 日志等级，不设置所有日志将在同一个文件
          level: 'info',
        }),
        // 同上述方法，区分error日志和info日志，保存在不同文件，方便问题排查
        new transports.DailyRotateFile({
          dirname: process.cwd() + '/src/logs',
          filename: 'application-%DATE%.error.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          format: format.combine(
            format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            format.json(),
          ),
          level: 'error',
        }),
      ],
    });
  }
  log(message: string, context: string) {
    const timestamp = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    this.logger.log('info', message, { context, timestamp });
  }
  info(message: string, context: string) {
    const timestamp = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    this.logger.info(message, { context, timestamp });
  }
  error(message: string, context: string) {
    const timestamp = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    this.logger.error(message, { context, timestamp });
  }
  warn(message: string, context: string) {
    const timestamp = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    this.logger.warn(message, { context, timestamp });
  }
}
