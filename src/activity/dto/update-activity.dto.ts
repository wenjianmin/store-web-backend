import { PartialType } from '@nestjs/mapped-types';
import { CreateActivityDto } from './create-activity.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateActivityDto extends PartialType(CreateActivityDto) {
  @IsNotEmpty({ message: '活动id不能为空' })
  id: number
  
  status?: number
}
