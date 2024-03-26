import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from 'src/sys/dto/login-user.dto';
import { RedisService } from 'src/common/redis/redis.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import { compare, genSalt, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { classToPlain, plainToClass } from 'class-transformer'
import { UserListDto } from './dto/user-list.dto';
import { UserType } from 'src/common/enums/common.enum';
import { getRedisKey } from 'src/common/utils';
import { RedisKeyPrefix } from 'src/common/enums/redis-key.enum';
import { UserRoleEntity } from './entities/user-role.entity';

@Injectable()
export class UserService {
  @Inject(RedisService)
  private redisService: RedisService;
  @InjectRepository(UserEntity)
  private userRepository: Repository<UserEntity>;
  @InjectRepository(UserRoleEntity)
  private userRoleRepository: Repository<UserRoleEntity>;

  @Inject(JwtService)
  private jwtService: JwtService;

  /**
   * 注册新用户
   *
   * @param createUserDto 创建用户所需的DTO对象
   * @returns 返回新创建的用户信息
   * @throws 当用户名已存在时，抛出HttpException异常，状态码为HttpStatus.CONFLICT
   */
  async registry(createUserDto: CreateUserDto) {
    // 1. 判断用户是否存在
    const user = await this.userRepository.findOne({
      where: {
        username: createUserDto.username,
      },
    });
    // 2. 存在则返回错误信息
    if (user) {
      throw new HttpException('用户名已存在，请重新输入', HttpStatus.CONFLICT);
    }
    // 3. 哈希加密
    const salt = await genSalt()
    createUserDto.password = await hash(createUserDto.password, salt);
    const newUser = plainToClass(UserEntity, createUserDto, {ignoreDecorators: true});
    // 3. 不存在则创建用户
    const { password, ...rest } = await this.userRepository.save(newUser);    
    return rest;
  }

  /**
   * 登录方法
   *
   * @param loginUserDto 登录用户信息
   * @returns 返回生成的token
   * @throws 当账号或密码错误时，抛出HttpException异常
   * @throws 当账号被冻结时，抛出HttpException异常
   */
  async login(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        username: loginUserDto.username,
      },
    });
    // 1. 判断用户是否存在
    if (!user) {
      throw new HttpException('账号或密码错误', HttpStatus.EXPECTATION_FAILED);
    }
    // 2. 判断密码是否正确
    const checkPassword = await compare(loginUserDto.password, user.password);
    if (!checkPassword) {
      throw new HttpException('账号或密码错误', HttpStatus.EXPECTATION_FAILED);
    }
    // 3. 判断用户是否冻结
    if (user.freezed) {
      throw new HttpException('账号已被冻结，请联系管理员', HttpStatus.EXPECTATION_FAILED);
    }
    // 4. 生成token
    const access_token = this.generateAccessToken({ username: user.username, id: user.id })
    return {
      access_token
    };
  }

  generateAccessToken(payload: { username: string, id: number}): string {
    return this.jwtService.sign(payload)
  }

  verifyToken(token: string): string{
    if (!token) return null
    const id = this.jwtService.verify(token.replace('Bearer ', ''))
    return id 
  }

  /**
   * 根据用户查询列表
   *
   * @param dto 用户查询条件
   * @returns 用户列表及总数
   */
  async findUserList(dto: UserListDto) {
    const { username, page, pageSize } = dto
    // 1. 根据用户名模糊查询
    const where = {
      ...(username ? {username: Like(`%${username}%`)}  : null)
    }
    return await this.userRepository.findAndCount({
      where,
      order: { id: 'DESC' },
      skip: pageSize * (page - 1),
      take: pageSize,
    });
  }

  /**
   * 根据ID查找用户信息
   *
   * @param id 用户ID
   * @returns 返回用户实体对象
   */
  async findOneById(id: number): Promise<UserEntity>  {
    // 1. 先从Redis中查询用户缓存
    const redisKey = getRedisKey(RedisKeyPrefix.USER_INFO, id)
    const result = await this.redisService.hGetAll(redisKey) || {}
    let user = plainToClass(UserEntity, result, { enableImplicitConversion: true })
    // 2. 缓存中没有再查库
    if (!user.id) {
      user = await this.userRepository.findOneBy({id})
      if (!user) return null
      // 3. 设置缓存
      await this.redisService.hSet(
        redisKey,
        classToPlain(user)
      )
    }
    delete user.password
    return user;
  }

  /**
   * 更新用户信息
   *
   * @param updateUserDto 更新用户DTO
   * @param currentUser 当前用户
   * @returns 更新成功提示
   * @throws 用户不存在异常
   * @throws 没有权限修改管理员信息异常
   */
  async update(updateUserDto: UpdateUserDto, currentUser: UserEntity) {
    // 1. 判断用户是否存在
    const user = await this.userRepository.findOne({where: { id: updateUserDto.id }});
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.EXPECTATION_FAILED);
    }
    // 2. 普通用户不能修改管理员信息
    if (user.userType === UserType.ADMIN_USER && currentUser.userType === UserType.NORMAL_USER) {
      throw new HttpException('你没有权限修改管理员信息', HttpStatus.UNAUTHORIZED);
    }
    // 3. 更新数据
    const { password, ...rest } = await this.userRepository.save(
      plainToClass(UserEntity, {
        ...user,
        ...updateUserDto,
      }, { ignoreDecorators: true })
    );
    // 4. 更新用户角色表
    if (updateUserDto.roleIds) {
      const roles = updateUserDto.roleIds.map(item => ({ userId: user.id, roleId: item }))
      const result = await this.userRoleRepository.save(roles)
      if (!result) {
        throw new HttpException('更新失败，请稍后重试', HttpStatus.EXPECTATION_FAILED);
      }
    }
    // 5. 更新redis缓存
    const redisKey = getRedisKey(RedisKeyPrefix.USER_INFO, updateUserDto.id)
    await this.redisService.hSet(
      redisKey,
      classToPlain(rest)
    );
    return '更新成功';
  }

  /**
   * 删除指定ID的用户
   *
   * @param id 用户ID
   * @returns 返回删除结果，成功返回'删除成功'，失败抛出异常
   * @throws 当用户不存在时，抛出'用户不存在'的Http异常
   * @throws 当删除失败时，抛出'删除失败，请稍后重试'的Http异常
   */
  async delete(id: number) {
    // 1. 判断用户是否存在
    const user = await this.userRepository.findOne({where: {id}});
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.EXPECTATION_FAILED);
    }

    const { affected } = await this.userRepository.delete({id})
    if (!affected) {
      throw new HttpException('删除失败，请稍后重试', HttpStatus.EXPECTATION_FAILED);
    }
    return '删除成功'
  }

  /**
   * 更新用户冻结状态
   *
   * @param id 用户ID
   * @param freezed 是否冻结
   * @param currUserId 当前用户ID
   * @returns 操作成功
   * @throws 用户不能冻结自己
   * @throws 用户不存在
   * @throws 你没有权限修改管理员信息
   * @throws 冻结或解冻失败，请稍后重试
   */
  async updateFreezedStatus(id: number, freezed: boolean, currUserId: number) {
    // 1. 用户不能冻结自己
    if (id === currUserId) {
      throw new HttpException('你不能冻结自己', HttpStatus.EXPECTATION_FAILED);
    }
    // 2. 判断用户是否存在
    const user = await this.userRepository.findOne({where: {id}});
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.EXPECTATION_FAILED);
    }
    // 3. 管理员是有最高权限的，不需要被冻结
    if (user.userType === UserType.ADMIN_USER) {
      throw new HttpException('你没有权限修改管理员信息', HttpStatus.UNAUTHORIZED);
    }
    // 3. 更新数据
    const { affected } = await this.userRepository.update({ id }, { freezed });
    if (!affected) {
      throw new HttpException(`${freezed ? '冻结' : '解冻'}失败，请稍后重试`, HttpStatus.EXPECTATION_FAILED);
    }
    return '操作成功';
  }
}
