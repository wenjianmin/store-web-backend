import { Module } from '@nestjs/common';
import { SysService } from './sys.service';
import { SysController } from './sys.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { MailService } from 'src/common/mail/mail.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([UserEntity]),
    MulterModule.register({
      // 定义存储引擎
      storage: diskStorage({
        // 定义文件存储的目录
        destination: './uploads', 
        filename: (_, file, cb) => {
          // 创建随机文件名
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      
    }),
  ],
  controllers: [SysController],
  providers: [SysService, MailService],
})
export class SysModule {}
