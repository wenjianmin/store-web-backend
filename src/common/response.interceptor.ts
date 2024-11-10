import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Logger } from './logger/logger';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.getArgByIndex(1).req;
    const res = context.switchToHttp().getResponse()
    return next.handle().pipe(
      map((data) => {
        const logFormat = `
##############################################################################################################
Request original url: ${req.originalUrl}
Method: ${req.method}
IP: ${req.ip}
Response data: ${data.socket ? null : JSON.stringify(data)}
##############################################################################################################
`;
        this.logger.info(logFormat, 'Response ResponseInterceptor');
        return {
          data,
          code: res.statusCode,
          success: true
        };
      }),
    );
  }
}
