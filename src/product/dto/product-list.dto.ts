import { IsArray, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, Length } from "class-validator";
import { QueryList } from "src/common/utils/query-list";

export class ProductListDto extends QueryList {
  name?: string
  status?: number
  topN?: number 
}
