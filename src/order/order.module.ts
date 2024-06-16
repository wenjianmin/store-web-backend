import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { ProductEntity } from 'src/product/entities/product.entity';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [ProductModule, TypeOrmModule.forFeature([OrderEntity, ProductEntity])],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
