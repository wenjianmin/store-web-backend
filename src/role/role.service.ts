import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { RolePermissionEntity } from './entities/role-permission.entity';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class RoleService {
  @InjectRepository(RoleEntity)
  private roleRepository: Repository<RoleEntity>
  // 角色权限表
  @InjectRepository(RolePermissionEntity)
  private rolePermissionRepository: Repository<RolePermissionEntity>
  async create(createRoleDto: CreateRoleDto) {
    if (!createRoleDto.permissions) {
      throw new HttpException('缺少permissions参数', HttpStatus.EXPECTATION_FAILED);
    }
    // 保存角色
    const role = await this.roleRepository.save(plainToClass(RoleEntity, createRoleDto))
    if (!role) {
      throw new HttpException('创建失败，请稍后重试', HttpStatus.EXPECTATION_FAILED);
    }
    const rolePermissions = createRoleDto.permissions.map(item => {
      return {
        roleId: role.id,
        permissionId: item
      }
    })
    // 保存角色权限表
    const rolePermission = await this.rolePermissionRepository.save(rolePermissions)
    if (!rolePermission) {
      throw new HttpException('创建失败，请稍后重试', HttpStatus.EXPECTATION_FAILED);
    }
    return "创建成功";
  }

  /**
   * 获取角色列表
   *
   * @returns 返回一个包含角色列表的Promise对象
   */
  async getRoleList() {
    return await this.roleRepository.find({ order: { id: 'DESC' }});
  }

  /**
   * 更新角色信息
   *
   * @param updateRoleDto 角色更新信息
   * @returns 返回更新结果
   * @throws 当角色不存在或已删除时，抛出 HttpException 异常
   * @throws 当更新角色表或角色权限表失败时，抛出 HttpException 异常
   */
  async update(updateRoleDto: UpdateRoleDto) {
    // 1. 判断角色是否存在
    const roleExist = await this.roleRepository.findOneBy({id: updateRoleDto.id})
    if (!roleExist) {
      throw new HttpException('角色不存在或已删除', HttpStatus.EXPECTATION_FAILED);
    }
    // 2. 更新角色表
    const role = await this.roleRepository.save(plainToClass(RoleEntity, updateRoleDto))
    if (!role) {
      throw new HttpException('更新失败，请稍后重试', HttpStatus.EXPECTATION_FAILED);
    }
    // 3. 更新角色权限表
    if (updateRoleDto.permissions) {
      const rolePermissions = updateRoleDto.permissions.map(item => {
        return {
          roleId: role.id,
          permissionId: item
        }
      })
      const result = await this.rolePermissionRepository.save(rolePermissions)
      if (!result) {
        throw new HttpException('更新失败，请稍后重试', HttpStatus.EXPECTATION_FAILED);
      }
    }
    return '更新成功';
  }

  async remove(id: number) {
    // 1. 判断角色是否存在
    const roleExist = await this.roleRepository.findOneBy({ id})
    if (!roleExist) {
      throw new HttpException('角色不存在或已删除', HttpStatus.EXPECTATION_FAILED);
    }
    // 2. 删除角色
    const { affected } = await this.roleRepository.delete({id})
    if (!affected) {
      throw new HttpException('删除失败，请稍后重试', HttpStatus.EXPECTATION_FAILED);
    }
    return '删除成功';
  }
}
