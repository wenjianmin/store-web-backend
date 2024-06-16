import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { ActivityStatus, UserType } from 'src/common/enums/common.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityEntity } from './entities/activity.entity';
import { DataSource, Like, Repository } from 'typeorm';
import { ActivityListDto } from './dto/activity-list.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ActivityService {
  @InjectRepository(ActivityEntity)
  private activityRepository: Repository<ActivityEntity>
  @Inject(DataSource)
  private dataSource: DataSource

  /**
   * 创建活动
   *
   * @param createActivityDto 创建活动的DTO
   * @param currentUser 当前用户
   * @returns 返回创建成功提示
   * @throws 当用户类型不是管理员时，抛出权限异常
   * @throws 当结束时间小于当前时间时，抛出期望失败异常
   * @throws 当开始时间大于结束时间时，抛出期望失败异常
   * @throws 当创建活动失败时，抛出内部服务器错误异常
   */
  async create(createActivityDto: CreateActivityDto, currentUser: UserEntity) {
    if (currentUser.userType !== UserType.ADMIN_USER) {
      throw new HttpException('您没有权限创建活动，请联系管理员', HttpStatus.FORBIDDEN)
    }
    const { startTime, endTime } = createActivityDto 
    let status = ActivityStatus.NOT_START
    if (new Date(endTime).getTime() < Date.now()) {
      throw new HttpException('结束时间不能小于当前时间', HttpStatus.EXPECTATION_FAILED)
    }
    if (startTime > endTime) {
      throw new HttpException('开始时间不能大于结束时间', HttpStatus.EXPECTATION_FAILED)
    }
    if (new Date(startTime).getTime() < Date.now()) {
      status = ActivityStatus.IN_PROGRESS
    }
    const activity = await this.activityRepository.save({...createActivityDto, status})
    if (!activity) {
      throw new HttpException('创建失败', HttpStatus.INTERNAL_SERVER_ERROR)
    }
    return '创建成功';
  }

  /**
   * 获取活动列表
   *
   * @param dto 活动列表查询参数
   * @returns 返回活动列表及总数
   */
  async getActList(dto: ActivityListDto) {
    const { page, pageSize, name, type, status } = dto
    const where = {
      ...(name ? { name: Like(`%${name}%`) } : null),
      ...(type ? { type } : null),
      ...(status ? { status } : null),
    }
    const queryBuilder = this.dataSource
    .createQueryBuilder('store_activity', 'act')
    .leftJoinAndSelect('store_product', 'p', 'p.id = act.productId')
    .select(['act.*', "JSON_OBJECT('name', p.name, 'price', p.price) as product"])

    const total = await queryBuilder.getCount()

    const list = await queryBuilder
    .where(where)
    .skip(pageSize * (page - 1))
    .take(pageSize)
    .orderBy('act.id', 'DESC')
    .getRawMany()

    return {
      list,
      total
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} activity`;
  }

  /**
   * 更新活动信息
   *
   * @param updateActivityDto 更新活动信息的DTO
   * @returns 返回更新成功的提示信息
   * @throws 当活动不存在或已删除时，抛出Http异常，状态码为404
   * @throws 当活动已结束时，抛出Http异常，状态码为417
   * @throws 当结束时间小于当前时间时，抛出Http异常，状态码为417
   * @throws 当更新失败时，抛出Http异常，状态码为417
   */
  async update(updateActivityDto: UpdateActivityDto) {
    const { id, startTime, endTime } = updateActivityDto
    const exists = await this.activityRepository.findOneBy({id})
    if (!exists) {
      throw new HttpException('活动不存在或已删除', HttpStatus.NOT_FOUND)
    }
    if (exists.status === ActivityStatus.END) {
      throw new HttpException('活动已结束，不能修改', HttpStatus.EXPECTATION_FAILED)
    }
    if (new Date(endTime).getTime() < Date.now()) {
      throw new HttpException('结束时间不能小于当前时间', HttpStatus.EXPECTATION_FAILED)
    }
    let newStatus = updateActivityDto.status || exists.status
    if (new Date(startTime).getTime() < Date.now()) {
      newStatus = ActivityStatus.IN_PROGRESS
    }
    const activity = await this.activityRepository.save(plainToClass(ActivityEntity, { ...exists, ...updateActivityDto, newStatus }))
    if (!activity) {
      throw new HttpException('更新失败', HttpStatus.EXPECTATION_FAILED)
    }

    return '更新成功'
  }

  /**
   * 删除活动
   *
   * @param id 活动ID
   * @returns 返回删除成功的字符串
   * @throws HttpException 当活动不存在或已删除时抛出未找到异常
   * @throws HttpException 当删除失败时抛出期望失败异常
   */
  async delete(id: number) {
    const exists = await this.activityRepository.findOneBy({id})
    if (!exists) {
      throw new HttpException('活动不存在或已删除', HttpStatus.NOT_FOUND)
    }
    const { affected } = await this.activityRepository.delete({ id })
    if (!affected) {
      throw new HttpException('删除失败，请稍后重试', HttpStatus.EXPECTATION_FAILED)
    }
    
    return '删除成功';
  }
}
