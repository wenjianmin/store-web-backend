import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @Get('list')
  /**
   * 获取权限列表
   *
   * @returns 返回权限列表
   */
  getPermList(@Req() req) {
    return this.permissionService.getPermMenuList(req.user);
  }
}
