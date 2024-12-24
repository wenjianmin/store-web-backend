import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from 'src/sys/dto/login-user.dto';
import { RedisService } from 'src/common/redis/redis.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { DataSource, In, Like, Repository } from 'typeorm';
import { compare, genSalt, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { classToPlain, plainToClass } from 'class-transformer';
import { UserListDto } from './dto/user-list.dto';
import { UserType } from 'src/common/enums/common.enum';
import { getRedisKey } from 'src/common/utils';
import { RedisKeyPrefix } from 'src/common/enums/redis-key.enum';
import { UserRoleEntity } from './entities/user-role.entity';
import { ForgotUserDto } from 'src/sys/dto/forgot-user.dto';
import { MailService } from 'src/common/mail/mail.service';
import { RoleEntity } from 'src/role/entities/role.entity';

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
  @Inject(MailService)
  private mailService: MailService;
  @Inject(DataSource)
  private dataSource: DataSource;

  /**
   * 注册新用户
   *
   * @param createUserDto 创建用户Dto
   * @returns 返回用户信息
   * @throws 如果用户名或注册邮箱已存在，返回冲突错误
   * @throws 如果两次输入的密码不一致，返回预期失败错误
   * @throws 如果验证码有误或已过期，返回预期失败错误
   */
  async registry(createUserDto: CreateUserDto) {
    const { username, email } = createUserDto;
    // 1. 判断用户是否存在，参数为邮箱或者用户名查询，使用createQueryBuilder一次性查询两个字段
    const user = await this.userRepository
      .createQueryBuilder('su')
      .where('su.username = :username OR su.email = :email', {
        username,
        email,
      })
      .getOne();
    // 2. 存在则返回错误信息
    if (user) {
      throw new HttpException(
        '用户名或注册邮箱已存在，请重新输入',
        HttpStatus.CONFLICT,
      );
    }
    if (createUserDto.confirmPassword !== createUserDto.password) {
      throw new HttpException(
        '两次输入的密码不一致，请重新输入',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    // 3. 校验注册验证码
    const codeRedisKey = getRedisKey(
      RedisKeyPrefix.REGISTRY_CODE,
      createUserDto.email,
    );
    const code = await this.redisService.get(codeRedisKey);
    if (!code || code !== createUserDto.code) {
      throw new HttpException(
        '验证码有误或已过期',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    // 3. 哈希加密
    const salt = await genSalt();
    createUserDto.password = await hash(createUserDto.password, salt);

    const newUser = plainToClass(
      UserEntity,
      { salt, ...createUserDto },
      { ignoreDecorators: true },
    );
    // 3. 不存在则创建用户
    const {
      password,
      salt: salter,
      ...rest
    } = await this.userRepository.save(newUser);
    // 4. 缓存用户信息
    const redisKey = getRedisKey(RedisKeyPrefix.USER_INFO, rest.id);
    await this.redisService.hSet(redisKey, rest);
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
      throw new HttpException(
        '账号已被冻结，请联系管理员',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    // 4. 生成token
    const { password, salt, ...rest } = user;
    console.log('user', user);
    const access_token = this.generateAccessToken(rest);
    return {
      access_token,
    };
  }

  generateAccessToken(payload: Record<string, any>): string {
    return this.jwtService.sign(payload);
  }

  verifyToken(token: string): string {
    if (!token) return null;
    const id = this.jwtService.verify(token.replace('Bearer ', ''));
    return id;
  }
  /**
   * 获取用户列表
   *
   * @returns 返回用户列表、用户总数、当前页码
   */
  async getUserList(dto: UserListDto) {
    const { username, page, pageSize } = dto;
    const skipCount = pageSize * (page - 1);
    let queryBuilder = this.dataSource
      .createQueryBuilder('store_user', 'u')
      .leftJoin('store_user_role', 'ur', 'ur.userId = u.id')
      .leftJoin('store_role', 'r', 'r.id = ur.roleId')
      .select([
        'u.*',
        "JSON_ARRAYAGG(JSON_OBJECT('id', r.id, 'name', r.name)) as roles",
      ])
      .groupBy('u.id');

    // 如果有模糊检索条件
    if (username) {
      queryBuilder = queryBuilder
        .where('u.username Like :username')
        .setParameter('username', `%${username}%`);
    }
    const list = await queryBuilder.skip(skipCount).take(pageSize).getRawMany();

    return {
      list: list.map((user) => {
        Reflect.deleteProperty(user, 'password');
        Reflect.deleteProperty(user, 'salt');
        return user;
      }),
      total: list.length,
      page,
    };
  }

  /**
   * 根据ID查找用户信息
   *
   * @param id 用户ID
   * @returns 返回用户实体对象
   */
  async findOneById(id: number): Promise<UserEntity> {
    // 1. 先从Redis中查询用户缓存
    const redisKey = getRedisKey(RedisKeyPrefix.USER_INFO, id);
    const result = (await this.redisService.hGetAll(redisKey)) || {};
    let user = plainToClass(UserEntity, result, {
      enableImplicitConversion: true,
    });
    // 2. 缓存中没有再查库
    if (!user.id) {
      user = await this.userRepository.findOneBy({ id });
      if (!user) return null;
      // 3. 设置缓存
      await this.redisService.hSet(redisKey, classToPlain(user));
    }
    delete user.password;
    return user;
  }

  /**
   * 获取当前用户信息
   *
   * @param currentUser 当前用户实体
   * @returns 返回当前用户信息和用户角色及权限
   */
  async getCurrentUser(currentUser: UserEntity) {
    // 同时查询用户角色和权限
    const queryBuilder = this.dataSource
      .createQueryBuilder()
      .select([
        'user.id AS userId',
        'user.username AS userName',
        'role.id AS roleId',
        'role.name AS roleName',
        'p.id AS permissionId',
        'p.title AS permissionTitle',
        'p.type AS permissionType',
        'p.code AS permissionCode',
      ])
      .from('store_user', 'user')
      .leftJoin('store_user_role', 'userRole', 'user.id = userRole.userId')
      .leftJoin('store_role', 'role', 'userRole.roleId = role.id')
      .leftJoin(
        'store_role_permission',
        'rolePerm',
        'role.id = rolePerm.roleId',
      )
      .leftJoin('store_permission', 'p', 'rolePerm.permissionId = p.id')
      .where('user.id = :userId', { userId: currentUser.id })
      .orderBy('p.id', 'ASC');

    const enrichedData = await queryBuilder.getRawMany();
    // 这里，我们需要对enrichedData进行一些后处理，以将其转换为所需的格式
    const roles = enrichedData.reduce((acc, row) => {
      if (!acc.includes(row.roleId)) {
        acc.push(row.roleId);
      }
      return acc;
    }, [] as number[]);

    const permissions = enrichedData.map((row) => ({
      id: row.permissionId,
      title: row.permissionTitle,
      type: row.permissionType,
      code: row.permissionCode,
    }));

    return {
      ...currentUser,
      menus: permissions,
      roles: roles.map((roleId: number) => ({ id: roleId })),
    };
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
    const user = await this.userRepository.findOne({
      where: { id: updateUserDto.id },
    });
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.EXPECTATION_FAILED);
    }
    // 2. 普通用户不能修改管理员信息
    if (
      user.userType === UserType.ADMIN_USER &&
      currentUser.userType === UserType.NORMAL_USER
    ) {
      throw new HttpException('你没有权限修改管理员信息', HttpStatus.FORBIDDEN);
    }
    // 3. 更新数据
    const { password, ...rest } = await this.userRepository.save(
      plainToClass(
        UserEntity,
        {
          ...user,
          ...updateUserDto,
        },
        { ignoreDecorators: true },
      ),
    );
    // 4. 更新用户角色表
    if (updateUserDto.roleIds) {
      // 4.1 先删除用户角色表
      await this.userRoleRepository.delete({ userId: user.id });
      const roles = updateUserDto.roleIds.map((item) => ({
        userId: user.id,
        roleId: item,
      }));
      const result = await this.userRoleRepository.save(roles);
      if (!result) {
        throw new HttpException(
          '更新失败，请稍后重试',
          HttpStatus.EXPECTATION_FAILED,
        );
      }
    }
    // 5. 更新redis缓存
    const redisKey = getRedisKey(RedisKeyPrefix.USER_INFO, updateUserDto.id);
    await this.redisService.hSet(redisKey, classToPlain(rest));
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
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.EXPECTATION_FAILED);
    }
    if (user.userType === UserType.ADMIN_USER) {
      throw new HttpException('你没有权限删除管理员', HttpStatus.FORBIDDEN);
    }
    const { affected } = await this.userRepository.delete({ id });
    if (!affected) {
      throw new HttpException(
        '删除失败，请稍后重试',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    // 2. 删除角色关联表
    const result = await this.userRoleRepository.delete({ userId: id });
    if (!result) {
      throw new HttpException(
        '删除失败，请稍后重试',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    // 3. 删除redis缓存
    const redisKey = getRedisKey(RedisKeyPrefix.USER_INFO, id);
    await this.redisService.del(redisKey);

    return '删除成功';
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
  async updateFreezedStatus(id: number, freezed: number, currUserId: number) {
    // 1. 用户不能冻结自己
    if (id === currUserId) {
      throw new HttpException('你不能冻结自己', HttpStatus.EXPECTATION_FAILED);
    }
    // 2. 判断用户是否存在
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.EXPECTATION_FAILED);
    }
    // 3. 管理员是有最高权限的，不需要被冻结
    if (user.userType === UserType.ADMIN_USER) {
      throw new HttpException('你没有权限修改管理员信息', HttpStatus.FORBIDDEN);
    }
    // 4. 更新数据
    const { affected } = await this.userRepository.update({ id }, { freezed });
    if (!affected) {
      throw new HttpException(
        `${freezed ? '冻结' : '解冻'}失败，请稍后重试`,
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    // 5. 更新redis缓存
    const redisKey = getRedisKey(RedisKeyPrefix.USER_INFO, id);
    const { password, ...rest } = user;
    await this.redisService.hSet(redisKey, classToPlain({ ...rest, freezed }));

    return '操作成功';
  }

  /**
   * 更新用户密码
   *
   * @param dtoForgotUserDto 用户信息对象
   * @returns 修改成功信息
   * @throws 验证码错误或已过期，用户不存在或已删除，用户已被冻结，两次输入的密码不一致，修改失败
   */
  async updatePassword(dto: ForgotUserDto) {
    const { password, confirmPassword, code, username } = dto;
    if (password !== confirmPassword) {
      throw new HttpException(
        '两次输入的密码不一致',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    // 1. 判断用户是否存在
    const exists = await this.userRepository.findOneBy({ username });
    if (!exists) {
      throw new HttpException(
        '用户不存在或已删除',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    const { id, freezed } = exists;
    if (freezed) {
      throw new HttpException(
        '用户已被冻结，请解冻后再修改',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    // 2. 验证Redis中的code与用户输入的code是否一致
    const cacheCode = await this.redisService.get(
      getRedisKey(RedisKeyPrefix.PASSWORD_RESET, id),
    );

    if (cacheCode != code) {
      throw new HttpException(
        '验证码错误或已过期',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    // 3. 更新密码
    const newPassword = await hash(password, exists.salt);
    const { affected } = await this.userRepository.update(
      { id },
      { password: newPassword },
    );
    if (!affected) {
      throw new HttpException(
        '修改失败，请稍后重试',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    // 4. 删除redis缓存的验证码和用户信息
    const codeRedisKey = getRedisKey(RedisKeyPrefix.PASSWORD_RESET, id);
    this.redisService.del(codeRedisKey);

    const userRedisKey = getRedisKey(RedisKeyPrefix.USER_INFO, id);
    this.redisService.del(userRedisKey);

    return '修改成功，请重新登录';
  }

  // 发送修改密码验证码
  /**
   * @deprecated
   * @param email
   * @returns
   */
  async sendCode(email: string) {
    // 1. 判断用户是否存在
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new HttpException(
        '请输入用户注册时填写的邮箱地址',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    // 2. 发送邮件
    const { code } = await this.mailService.sendMail(email, '修改密码');
    // 3. 将验证码存入redis缓存中，并设置过期时间
    const redisKey = getRedisKey(RedisKeyPrefix.PASSWORD_RESET, user.id);
    this.redisService.set(redisKey, code, 60 * 5); // 5分钟有效
    return '验证码已发送至邮箱，请注意查收';
  }
}
