import { IsNumber, IsOptional } from "class-validator";

export class CreateOrderDto {
  @IsOptional()
  @IsNumber({}, { message: "商品数量类型为number" })
  count?: number

  @IsOptional()
  @IsNumber({}, { message: '订单状态类型为number' })
  status?: 0 | 1

  @IsOptional()
  @IsNumber({}, { message: "订单折扣类型为number" })
  discount?: number

}
