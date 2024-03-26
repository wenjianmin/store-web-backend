import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreateRoleDto {
  @IsNotEmpty({ message: '角色名称不能为空' })
  @IsString({ message: '角色名称为string类型' })
  name: string

  @IsString({ message: '角色描述为string类型' })
  desc?: string

  @IsArray({ message: '角色权限集合为Array类型' })
  permissions: number[]

}
