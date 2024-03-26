import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('store_role_permission')
export class RolePermissionEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'int', comment: '角色id' })
  roleId: number

  @Column({ type: 'int', comment: '权限集id' })
  permissionId: number
}
