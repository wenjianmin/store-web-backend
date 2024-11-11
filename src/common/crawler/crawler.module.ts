import { Module } from '@nestjs/common';
import { ExcelController } from 'src/common/crawler/crawler.controller';
import { CrawlerService } from 'src/common/crawler/crawler.service';

@Module({
  controllers: [ExcelController],
  providers: [CrawlerService],
})
export class CrawlerModule {}
