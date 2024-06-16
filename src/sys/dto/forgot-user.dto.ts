import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class ForgotUserDto  {
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '用户名必须为string类型'})
  username: string
  
  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '密码必须为string类型'})
  password: string

  @IsNotEmpty({ message: '确认密码不能为空' })
  @IsString({ message: '确认密码必须为string类型'})
  confirmPassword: string

  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsString({ message: '确认密码必须为string类型'})
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string
  
  @IsNotEmpty({ message: '验证码不能为空' })
  code: string
}
