import { IsOptional } from "class-validator";
import { QueryList } from "src/common/utils/query-list";

export class ActivityListDto extends QueryList {
  @IsOptional()
  name?: string

  @IsOptional()
  type?: number

  @IsOptional()
  status?: number
}
