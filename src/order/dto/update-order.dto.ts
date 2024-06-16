import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateOrderDto {
  @IsNotEmpty({ message: '订单id不能为空' })
  @IsNumber({}, { message: '订单id类型为number' })
  id: number;

  @IsNotEmpty({ message: "订单状态不能为空" })
  @IsNumber({}, { message: '订单状态类型为number' })
  status: 1 | 2

  @IsOptional()
  desc: string
}
