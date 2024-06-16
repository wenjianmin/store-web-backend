import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisKeyPrefix } from 'src/common/enums/redis-key.enum';
import { MailService } from 'src/common/mail/mail.service';
import { RedisService } from 'src/common/redis/redis.service';
import { getRedisKey } from 'src/common/utils';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SysService {
  @Inject(MailService)
  private mailService: MailService;

  @Inject(RedisService)
  private redisService: RedisService;

  @InjectRepository(UserEntity)
  private userRepository: Repository<UserEntity>;

  /**
   * 发送找回密码邮件
   *
   * @param email 用户邮箱
   * @returns 返回验证码已发送至邮箱的提示信息
   * @throws 当邮箱为空时，抛出 HttpException 异常
   * @throws 当当前用户未绑定该邮箱时，抛出 HttpException 异常
   */
  async sendEmailForGorgot(email: string) {
    if (!email) {
      throw new HttpException('邮箱不能为空', HttpStatus.EXPECTATION_FAILED);
    }
    const exists = await this.userRepository.findOneBy({email})
    // 1. 判断当前的邮箱与用户注册邮箱是否一致
    if (!exists) {
      throw new HttpException('当前用户未绑定该邮箱，请检查后重试', HttpStatus.EXPECTATION_FAILED);
    }
    // 2. 发送邮箱验证码
    const { code } = await this.mailService.sendMail(email, '找回密码验证码')

    // 缓存Redis
    const redisKey = getRedisKey(RedisKeyPrefix.PASSWORD_RESET, exists.id);
    await this.redisService.set(redisKey, code, 60*5); // 5分钟有效
    return '验证码已发送至邮箱，请注意查收'
  }
  

  /**
   * 发送注册邮件验证码
   *
   * @param email 邮箱地址
   * @param text 邮件内容
   * @returns 返回发送成功信息
   */
  async sendMailForRegistry(email: string, text: string) {
    const { code } = await this.mailService.sendMail(email, text)
    // 缓存Redis
    const redisKey = getRedisKey(RedisKeyPrefix.REGISTRY_CODE, email);
    await this.redisService.set(redisKey, code, 60*5); 
    return '发送成功';
  }

  async upload(file: Express.Multer.File, type: string) {
    return {
      url: `http://localhost:3333/${file.path}`,
      type
    }
  }
}
