import { PermissionType } from "src/common/enums/common.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('store_permission')
export class PermissionEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 10, comment: '权限名称（菜单名称）' })
  title: string

  @Column({ type: 'varchar', length: 50, comment: '权限码' })
  code: string

  @Column({ type: 'int', comment: '权限类型 0 菜单 1 页面 2 组件 3 按钮' })
  type: PermissionType

  @Column({ type: 'int', comment: '父级id', default: 0 })
  parentId: number
}
