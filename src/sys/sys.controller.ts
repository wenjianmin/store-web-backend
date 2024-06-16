import { Controller, Get, Post, Body, Inject, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { SysService } from './sys.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { ForgotUserDto } from './dto/forgot-user.dto';
import { AllowNoToken } from 'src/common/decorators/token.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('sys')
export class SysController {
  @Inject(UserService)
  private userService: UserService;

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
  @AllowNoToken()
  forgot(@Body() forgotUserDto: ForgotUserDto) {
    return this.userService.updatePassword(forgotUserDto);
  }
  // 发送找回密码邮箱验证码
  @Get('sendEmailForGorgot')
  @AllowNoToken()
  sendEmailForGorgot(@Query() dto: { email: string }) {
    return this.sysService.sendEmailForGorgot(dto.email);
  }

  // 发送注册邮箱验证码
  @Get('sendEmailForRegistry')
  @AllowNoToken()
  sendEmailForRegistry(@Query() dto: { email: string }) {
    return this.sysService.sendMailForRegistry(dto.email,'注册验证码');
  }

  // 上传文件
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Body() data: { type: string }) {
    return this.sysService.upload(file, data.type)
  }
}
