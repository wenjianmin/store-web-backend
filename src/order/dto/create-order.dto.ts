import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateOrderDto {
  @IsOptional()
  @IsNumber({}, { message: '订单状态类型为number' })
  status: 0 | 1

  @IsOptional()
  @IsNumber({}, { message: "订单折扣类型为number" })
  discount: number

  @IsNotEmpty({ message: '订单数量不能为空' })
  @IsNumber({}, { message: '订单数量类型为number' })
  count: number

  @IsNotEmpty({ message: '开单商品不能为空' })
  productId: number

  @IsOptional()
  desc: string

}
