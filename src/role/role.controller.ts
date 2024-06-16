import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleListDto } from './dto/role-list.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  // 常见自定义角色
  @Post('create')
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  // 获取所有角色
  @Get('list')
  getRoleList(@Query() roleListDto: RoleListDto) {
    return this.roleService.getRoleList(roleListDto);
  }

  @Patch('edit')
  update(@Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(updateRoleDto);
  }

  @Get('delete/:id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }
}
