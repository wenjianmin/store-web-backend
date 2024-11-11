import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class FileLoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // 获取上传的文件信息
    const file = request.file;
    if (file) {
      console.log('File in Interceptor:', file); // 输出文件信息
      // 在这里可以处理文件信息，例如记录日志或进行文件验证等
    }

    return next.handle();
  }
}
