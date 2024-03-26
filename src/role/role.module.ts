import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { RolePermissionEntity } from './entities/role-permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoleEntity, RolePermissionEntity])
  ],
  controllers: [RoleController],
  providers: [RoleService]
})
export class RoleModule {}
