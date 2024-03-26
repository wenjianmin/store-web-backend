import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Logger } from 'src/common/logger/logger';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  @Inject(Logger)
  private logger: Logger
  use(req: Request, res: Response, next: NextFunction) {
    const statusCode = res.statusCode;
    const logFormat = `
##############################################################################################################
RequestOriginal: ${req.originalUrl}
Method: ${req.method}
IP: ${req.ip}
StatusCode: ${statusCode}
Params: ${JSON.stringify(req.params)}
Query: ${JSON.stringify(req.query)}
Body: ${JSON.stringify(req.body)}
##############################################################################################################
`;

    next();
    
    if (statusCode >= 500) {
      this.logger.error(logFormat, 'Request LoggerMiddleware');
    } else if (statusCode >= 400) {
      this.logger.warn(logFormat, 'Request LoggerMiddleware');
    } else {
      this.logger.log(logFormat, 'Request LoggerMiddleware');
    }
  }
}
