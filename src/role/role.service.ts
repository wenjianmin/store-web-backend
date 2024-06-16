import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { RolePermissionEntity } from './entities/role-permission.entity';
import { DataSource, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { UserEntity } from 'src/user/entities/user.entity';
import { PermissionEntity } from 'src/permission/entities/permission.entity';
import { RoleListDto } from './dto/role-list.dto';

@Injectable()
export class RoleService {
  @InjectRepository(RoleEntity)
  private roleRepository: Repository<RoleEntity>
  // 角色权限表
  @InjectRepository(RolePermissionEntity)
  private rolePermissionRepository: Repository<RolePermissionEntity>
  @Inject(DataSource)
  private dataSource: DataSource

  /**
   * 创建角色
   *
   * @param createRoleDto 创建角色的DTO对象
   * @returns 成功返回"创建成功"，失败抛出HttpException异常
   */
  async create(createRoleDto: CreateRoleDto) {
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
  async getRoleList(roleListDto: RoleListDto) {
    const { page, pageSize } = roleListDto
    const skipCount = pageSize * (page - 1)
    let queryBuilder = this.dataSource
      .createQueryBuilder('store_role', 'r')
      .leftJoin(RolePermissionEntity, "rp", "rp.roleId = r.id")
      .leftJoin(PermissionEntity, "p", "p.id = rp.permissionId")
      .select(['r.*', "JSON_ARRAYAGG(JSON_OBJECT('id', p.id, 'title', p.title)) as permissions"])
      .groupBy('r.id')
      .orderBy('r.isSystem', 'DESC')

      // 如果有模糊检索条件
      if (roleListDto.name) {
        queryBuilder = queryBuilder.where('r.name Like :name').setParameter('name', `%${roleListDto.name}%`)
      }
      if (roleListDto.pageSize && roleListDto.page) {
        queryBuilder = queryBuilder.skip(skipCount).take(pageSize)
      }
      const roleData = await queryBuilder.getRawMany()
    return {
      list: roleData,
    };
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
      // 3.1 删除角色权限表
      const { affected } = await this.rolePermissionRepository.delete({ roleId: updateRoleDto.id })
      if (!affected) {
        throw new HttpException('更新失败，请稍后重试', HttpStatus.EXPECTATION_FAILED);
      }
      // 3.2 新增角色权限表
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
    if (roleExist.isSystem) {
      throw new HttpException('系统角色不允许删除', HttpStatus.FORBIDDEN);
    }
    // 2. 删除角色
    const { affected } = await this.roleRepository.delete({id})
    if (!affected) {
      throw new HttpException('删除失败，请稍后重试', HttpStatus.EXPECTATION_FAILED);
    }
    return '删除成功';
  }
}
