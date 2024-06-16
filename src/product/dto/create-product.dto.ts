import { IsArray, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, Length } from "class-validator";

export class CreateProductDto {
  @IsNotEmpty({ message: '商品名称不能为空' })
  @IsString({ message: '商品名称必须为string类型' })
  @Length(2, 30, { message: '商品名称字符长度为2-30' })
  name: string

  @IsNotEmpty({ message: '商品价格不能为空' })
  @IsNumberString({}, { message: '请输入number类型的价格' })
  price: number

  @IsOptional()
  desc?: string

  @IsOptional()
  @IsArray({ message: '图片类型为文件id集合' })
  images?: string[]

  @IsOptional()
  @IsNumber({}, { message: '状态类型为number' })
  status?: 1 | 2

}
