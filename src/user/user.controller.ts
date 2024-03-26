import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserListDto } from './dto/user-list.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('list')
  /**
   * 获取用户列表
   *
   * @param dto 用户列表查询条件
   * @returns 用户列表
   */
  getUserList(@Query() dto: UserListDto) {
    return this.userService.findUserList(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOneById(+id);
  }

  @Patch('edit')
  update(@Body() updateUserDto: UpdateUserDto, @Req() req) {
    return this.userService.update(updateUserDto, req.user);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.delete(+id);
  }

  @Put('/update/freezed')
  updateFreezedStatus(@Body() dto: UpdateUserDto, @Req() req) {
    return this.userService.updateFreezedStatus(dto.id, dto.freezed, req.user.id);
  }
}
