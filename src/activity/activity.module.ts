import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityEntity } from './entities/activity.entity';
import { StartActivityCron } from './start-activity.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([ActivityEntity]),
    ScheduleModule.forRoot(),
  ],
  controllers: [ActivityController],
  providers: [ActivityService, StartActivityCron]
})
export class ActivityModule {}
