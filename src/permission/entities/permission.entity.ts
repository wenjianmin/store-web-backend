import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('store_permission')
export class PermissionEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 50, comment: '权限名称' })
  name: string

  @Column({ type: 'varchar', length: 100, comment: '权限码' })
  code: string
}
