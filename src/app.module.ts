import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { SysModule } from './sys/sys.module';
import { TypeOrmModule } from '@nestjs/typeorm'
import { LoggerMiddleware } from './common/logger.middleware';
import { LoggerModule } from './common/logger/logger.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionsFilter } from './common/http-exceptions.filter';
import { ResponseInterceptor } from './common/response.interceptor';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ConfigModule } from '@nestjs/config';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { RoleAuthGuard } from './auth/role-auth.guard';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { ActivityModule } from './activity/activity.module';

@Module({
  imports: [
    UserModule,
    SysModule,
    LoggerModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'jminjmin',
      database: 'store_web_project',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      // 生产环境中禁止开启，应该使用数据迁移
      synchronize: true
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RoleModule,
    PermissionModule,
    ProductModule,
    OrderModule,
    ActivityModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 应用过滤器
    {
      provide: APP_FILTER,
      useClass: HttpExceptionsFilter,
    },
    // 应用拦截器
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    // 应用jwt登录态验证守卫
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // 应用接口权限验证守卫
    // {
    //   provide: APP_GUARD,
    //   useClass: RoleAuthGuard,
    // },
  ],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
