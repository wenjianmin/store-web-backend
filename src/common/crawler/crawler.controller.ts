import { Controller, Get, Query } from '@nestjs/common';
import {
  CrawlerResult,
  CrawlerService,
} from 'src/common/crawler/crawler.service';
import { AllowNoToken } from 'src/common/decorators/token.decorator';

@Controller('crawler')
export class ExcelController {
  constructor(private readonly excelService: CrawlerService) {}

  @Get('/analysis-url')
  @AllowNoToken()
  async analysisUrl(@Query('url') url: string): Promise<CrawlerResult> {
    return this.excelService.extractUrlInfo(url);
  }
}
