import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  Put,
  Inject,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserListDto } from './dto/user-list.dto';
import { AllowNoToken } from 'src/common/decorators/token.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('list')
  /**
   * 获取所有用户列表
   *
   * @param dto 用户列表查询条件
   * @returns 用户列表
   */
  getUserList(@Query() dto: UserListDto) {
    return this.userService.getUserList(dto);
  }

  @Get('currentUser')
  /**
   * 获取当前用户信息
   *
   * @param req 请求对象
   * @returns 返回用户实体对象
   */
  getCurrentUser(@Req() req) {
    return this.userService.getCurrentUser(req.user);
  }

  @Get('info/:id')
  /**
   * 根据id查找用户
   *
   * @param id 用户id
   * @returns 返回用户对象
   */
  findOne(@Param('id') id: string) {
    return this.userService.findOneById(+id);
  }

  @Patch('edit')
  /**
   * 更新用户信息
   *
   * @param updateUserDto 更新用户信息的DTO
   * @param req HTTP请求对象
   * @returns 返回更新后的用户信息
   */
  update(@Body() updateUserDto: UpdateUserDto, @Req() req) {
    return this.userService.update(updateUserDto, req.user);
  }

  @Get('delete/:id')
  /**
   * 删除用户
   *
   * @param id 用户ID
   * @returns 删除结果
   */
  delete(@Param('id') id: string) {
    return this.userService.delete(+id);
  }

  @Patch('/update/freezed')
  /**
   * 更新用户冻结状态
   *
   * @param dto UpdateUserDto类型的DTO对象，包含需要更新的用户ID和冻结状态
   * @param req Request对象，包含请求信息
   * @returns 返回更新结果
   */
  updateFreezedStatus(@Body() dto: UpdateUserDto, @Req() req) {
    return this.userService.updateFreezedStatus(
      dto.id,
      dto.freezed,
      req.user.id,
    );
  }

  /**
   * @deprecated
   * @param query
   */
  @Get('sendMail')
  async sendMailForRegistry(@Query() query: { email: string }) {
    await this.userService.sendCode(query.email);
  }
}
