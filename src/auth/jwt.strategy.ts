import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
// 新增依赖
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  @Inject(AuthService)
  private authService: AuthService
  // 注入配置服务
  constructor(configService: ConfigService) {
    super({
      // 表示从header中的Authorization的Bearer表头中获取token值
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
      // 不忽视token过期的情况，过期会返回401
      ignoreExpiration: false, 
      // 读取配置中的secret
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: { id: number }) {
    const user = await this.authService.validateUser(payload);
    if (!user) throw new UnauthorizedException()
    
    return user;
  }
}
