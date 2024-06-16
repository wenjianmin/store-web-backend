import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('store_product')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ type: 'varchar', length: 50, comment: '商品名称'})
  name: string;

  @Column({ type: "decimal", precision: 10, scale: 2, comment: '商品价格'})
  price: number

  @Column({ type: 'simple-array', comment: '商品图片', nullable: true })
  images: string[]

  @Column({ type: 'text',  comment: '商品描述' })
  desc: string

  @Column({ type: 'int', comment: '商品状态 0 未上架  1 已上架 2 已下架'})
  status: number

  @CreateDateColumn({ type: 'datetime', comment: '创建时间'})
  createTime: Date

  @UpdateDateColumn({ type: 'datetime', comment: '更新时间'})
  updateTime: Date
}
