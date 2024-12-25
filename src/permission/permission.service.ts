import { Inject, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserType } from 'src/common/enums/common.enum';
import { PermissionEntity } from './entities/permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PermissionApiEntity } from './entities/permission-api.entity';
import { classToPlain } from 'class-transformer';
import { listToTree } from 'src/common/utils';

@Injectable()
export class PermissionService {
  @InjectRepository(PermissionEntity)
  private permissionRepository: Repository<PermissionEntity>;
  @InjectRepository(PermissionApiEntity)
  private permissionApiEntity: Repository<PermissionApiEntity>;

  @Inject(DataSource)
  private dataSource: DataSource;
  create(createPermissionDto: CreatePermissionDto) {
    return 'This action adds a new permission';
  }

  async getPermApiList(currentUser: UserEntity) {
    const userId = currentUser.id;
    let result = null;
    // 1. 超管获取全部接口权限
    if (currentUser.userType === UserType.ADMIN_USER) {
      result = await this.permissionRepository.find();
    } else {
      // 2. 非超管获取自己拥有的接口权限
      result = await this.dataSource
        .createQueryBuilder()
        .select(['pa.apiUrl AS url', 'pa.apiMethod AS method'])
        .from('store_user_role', 'ur')
        .leftJoin('store_role_permission', 'rp', 'ur.roleId = rp.roleId')
        .leftJoin(
          'store_permission_api',
          'pa',
          'rp.permissionId = pa.permissionId',
        )
        .where('ur.userId = :userId', { userId })
        .groupBy('pa.apiUrl')
        .addGroupBy('pa.apiMethod')
        .getRawMany();
    }
    return result;
  }

  async getPermMenuList(currentUser: UserEntity) {
    const userId = currentUser.id;
    let result = null;
    // 1. 超管获取全部权限
    if (currentUser.userType === UserType.ADMIN_USER) {
      result = await this.permissionRepository.find();
    } else {
      // 2. 非超管获取自己拥有的权限
      result = await this.dataSource
        .createQueryBuilder()
        .select('p.*')
        .from('store_user_role', 'ur')
        .leftJoin('store_role_permission', 'rp', 'ur.roleId = rp.roleId')
        .leftJoin('store_permission', 'p', 'rp.permissionId = p.id')
        .where('ur.userId = :userId', { userId })
        .groupBy('p.id')
        .getRawMany();
    }

    const list = listToTree(result, { root: 0, pidKey: 'parentId' });
    return {
      list,
    };
  }
}
