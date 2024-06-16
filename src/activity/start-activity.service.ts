import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { ActivityEntity } from "./entities/activity.entity";
import { Repository } from "typeorm";
import { ActivityStatus } from "src/common/enums/common.enum";

@Injectable()
export class StartActivityCron {
  @InjectRepository(ActivityEntity)
  private activityRepository: Repository<ActivityEntity>;

  // 每分钟执行一次，轮询未开始的活动
  @Cron('* * * * *')
  async setStartCron() {
    // 查询所有未开始的活动
    const activityList = await this.activityRepository.find({
      where: { status: ActivityStatus.NOT_START },
    });
    console.log('活动开始定时任务执行', activityList)

    // 设置活动开始
    for (const act of activityList) {
      if (act.startTime.getTime() <= Date.now()) {
        act.status = ActivityStatus.IN_PROGRESS
        await this.activityRepository.save(act)
      }
    }
  }
  // 每分钟执行一次，轮询进行中的活动
  @Cron('* * * * *')
  async setEndCron() {
    // 查询所有进行中的活动
    const activityList = await this.activityRepository.find({
      where: { status: ActivityStatus.IN_PROGRESS },
    });
    console.log('活动结束定时任务执行', activityList,)
    // 设置活动结束
    for (const act of activityList) {
      if (act.endTime.getTime() <= Date.now()) {
        act.status = ActivityStatus.END
        await this.activityRepository.save(act)
      }
    }
  }
}