import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionEntity } from './entities/permission.entity';
import { PermissionApiEntity } from './entities/permission-api.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PermissionEntity, PermissionApiEntity])
  ],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService]
})
export class PermissionModule {}
