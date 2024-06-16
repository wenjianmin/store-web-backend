import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('store_order')
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, comment: '商品名称' })
  name: string;

  @Column({ type: 'int', default: 1, comment: '商品数量' })
  count: number;

  @Column({ type: "decimal", precision: 5, scale: 2, default: 1, comment: '订单折扣' })
  discount: number;

  @Column({ type: "decimal", precision: 10, scale: 2, comment: '订单价格' })
  price: number

  @Column({ type: "decimal", precision: 10, scale: 2, comment: '订单折扣价' })
  discountPrice: number

  @Column({ type: 'int', comment: '订单状态 0 未付款 1 已付款 2 已取消' })
  status: number;

  @Column({ type: 'varchar', comment: '操作员' })
  operator: string;

  @CreateDateColumn({ type: 'timestamp', comment: '创建时间' })
  createTime: Date;

  @Column({ type: 'text', comment: '订单备注', nullable: true })
  desc: string;

  @Column({ type: 'int', comment: '商品id' })
  productId: number;
}
