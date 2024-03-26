import { QueryList } from "src/common/utils/query-list";

export class OrderListDto extends QueryList {
  orderId?: string;
  status?: 0 | 1 | 2
}
