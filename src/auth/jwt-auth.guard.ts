import { ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ALLOW_NO_TOKEN } from 'src/common/decorators/token.decorator';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private userService: UserService
  ) {
    super();
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    // 接口是否允许无 token 访问
    const allowNoToken = this.reflector.getAllAndOverride<boolean>(ALLOW_NO_TOKEN, [ctx.getHandler(), ctx.getClass()])
    if (allowNoToken) return true
    // 验证用户是否登录
    const req = ctx.switchToHttp().getRequest()
    const access_token = req.get('Authorization')
    if (!access_token) throw new ForbiddenException('您还未登录，请先登录后使用')
    const userId = this.userService.verifyToken(access_token)
    // 判断是否登录过期
    if (!userId) throw new ForbiddenException('登录过期，请重新登录')
    return super.canActivate(ctx) as Promise<boolean>
  }
}