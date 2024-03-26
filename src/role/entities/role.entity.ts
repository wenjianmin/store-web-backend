import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('store_role')
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 50, comment: '角色名称' })
  name: string
  
  @Column({ type: 'varchar', length: 255, comment: '角色描述'})
  desc: string

  @CreateDateColumn({ type: 'timestamp', comment: '创建时间' })
  createTime: Date

  @UpdateDateColumn({ type: 'timestamp', comment: '更新时间' })
  updateTime: Date
}
