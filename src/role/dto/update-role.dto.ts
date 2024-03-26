import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';
import { IsArray, IsNotEmpty } from 'class-validator';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @IsNotEmpty({ message: '角色ID不能为空' })
  id: number
  
  @IsArray({ message: '角色权限集合为Array类型' })
  permissions?: number[]
}
