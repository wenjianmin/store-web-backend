import { IsDateString, IsNotEmpty, IsNumber, IsString, Length } from "class-validator";

export class CreateActivityDto {
  @IsNotEmpty({ message: '活动名称不能为空'})
  @IsString({ message: '活动名称类型为string'})
  @Length(1, 20, { message: '活动名称长度为1-20位' })
  name: string;

  @IsNotEmpty({ message: '活动类型不能为空'})
  @IsNumber({}, { message: '活动类型为number类型' })
  type: number;

  @IsString({ message: '活动描述为string类型'})
  @Length(1, 200, { message: '活动描述长度为1-200位' })
  desc: string;

  @IsNotEmpty({ message: '活动开始时间不能为空'})
  @IsDateString({}, { message: '活动开始时间格式错误' })
  startTime: Date

  @IsNotEmpty({ message: '活动结束时间不能为空'})
  @IsDateString({}, { message: '活动结束时间格式错误' })
  endTime: Date
}
