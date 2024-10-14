import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductEntity } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HotSalesService } from './hot-sales.service';
import { ExcelService } from 'src/common/excel/excel.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  controllers: [ProductController],
  providers: [ProductService, HotSalesService, ExcelService],
  exports: [HotSalesService]
})
export class ProductModule {}
