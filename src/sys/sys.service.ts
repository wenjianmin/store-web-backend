import { Injectable } from '@nestjs/common';
import { ForgotUserDto } from './dto/forgot-user.dto';

@Injectable()
export class SysService {
  forgot(forgotUserDto: ForgotUserDto) {
    return '';
  }

  findAll() {
    return `This action returns all sys`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sy`;
  }

  remove(id: number) {
    return `This action removes a #${id} sy`;
  }
}
