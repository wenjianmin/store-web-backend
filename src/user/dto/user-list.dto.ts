import { QueryList } from "src/common/utils/query-list";


export class UserListDto extends QueryList{
  username?: string;
  freezed?: boolean;
}
