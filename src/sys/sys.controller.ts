import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { SysService } from './sys.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { ForgotUserDto } from './dto/forgot-user.dto';
import { RedisService } from 'src/common/redis/redis.service';
import { AllowNoToken } from 'src/common/decorators/token.decorator';

@Controller('sys')
export class SysController {
  @Inject(UserService)
  private userService: UserService;

  @Inject(RedisService)
  private redisService: RedisService;
  constructor(private readonly sysService: SysService) {}

  // 用户注册
  @Post('registry')
  @AllowNoToken()
  registry(@Body() createUserDto: CreateUserDto) {
    return this.userService.registry(createUserDto);
  }

  // 用户登录
  @Post('login')
  @AllowNoToken()
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  // 找回密码
  @Post('forgot')
  forgot(@Body() forgotUserDto: ForgotUserDto) {
    return this.sysService.forgot(forgotUserDto);
  }

  @Get()
  findAll() {
    return this.sysService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sysService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sysService.remove(+id);
  }
}
