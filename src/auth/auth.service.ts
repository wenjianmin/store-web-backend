import { Inject, Injectable } from "@nestjs/common";
import { UserEntity } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthService {
  @Inject(UserService)
  private userService: UserService;
  async validateUser(payload: { id: number }): Promise<UserEntity> {
    return await this.userService.findOneById(payload.id)
  }
}