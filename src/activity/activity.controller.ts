import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { ActivityListDto } from './dto/activity-list.dto';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post('create')
  create(@Body() createActivityDto: CreateActivityDto, @Req() req) {
    return this.activityService.create(createActivityDto, req.user);
  }

  @Get('list')
  getActList(@Query() actListDto: ActivityListDto) {
    return this.activityService.getActList(actListDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activityService.findOne(+id);
  }

  @Patch('edit')
  update(@Body() updateActivityDto: UpdateActivityDto) {
    return this.activityService.update(updateActivityDto);
  }

  @Get('delete/:id')
  delete(@Param('id') id: string ) {
    return this.activityService.delete(+id);
  }
}
