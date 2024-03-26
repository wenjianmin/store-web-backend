import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('store_order_product')
export class OrderProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', comment: '商品id' })
  productId: number;

  @Column({ type: 'int', comment: '订单id' })
  orderId: number;

}
