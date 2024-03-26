import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
  @IsNumber({}, {message: 'id 类型为number'})
  @IsNotEmpty({ message: 'id 不能为空' })
  id: number;

  @IsString({ message: '账号必须为string类型'})
  @IsOptional()
  username?: string

  @IsString({ message: '邮箱必须为string类型'})
  @IsEmail()
  @IsOptional()
  email?: string

  @IsBoolean({ message: '冻结状态必须为boolean类型'})
  @IsOptional()
  freezed?: boolean

  @IsOptional()
  roleIds?: number[]
}
