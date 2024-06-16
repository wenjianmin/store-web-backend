import { ActivityStatus } from "src/common/enums/common.enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('store_activity')
export class ActivityEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30, comment: '活动名称' })
  name: string;

  @Column({ type: 'int', comment: '活动状态 0 未开始 1 进行中 2 已结束', default: 0 })
  status: ActivityStatus

  @Column({ type: 'int', comment: '活动类型 0 普通活动 1 拼团活动' })
  type: number

  @Column({ type: 'text', comment: '活动描述' })
  desc: string

  @Column({ type: 'timestamp', comment: '活动开始时间' })
  startTime: Date
  
  @Column({ type: 'timestamp', comment: '活动结束时间' })
  endTime: Date

  @CreateDateColumn({ type: 'timestamp', comment: '创建时间' })
  createTime: Date

  @UpdateDateColumn({ type: 'timestamp', comment: '更新时间' })
  updateTime: Date

  @Column({ type: 'int', comment: '参与活动的商品id' })
  productId: number

}

