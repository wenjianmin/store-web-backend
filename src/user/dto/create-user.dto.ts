import { IsString, IsNotEmpty, IsEmail, IsNumber } from 'class-validator'
export class CreateUserDto {
  @IsNotEmpty({ message: '账号不能为空' })
  @IsString({ message: '账号必须为string类型'})
  username: string

  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '密码必须为string类型'})
  password: string

  @IsNotEmpty({ message: '确认密码不能为空' })
  confirmPassword: string

  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsString({ message: '邮箱必须为string类型'})
  @IsEmail()
  email: string

  @IsNotEmpty({ message: '验证码不能为空' })
  code: string

}
