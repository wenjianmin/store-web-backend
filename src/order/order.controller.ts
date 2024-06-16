import { Controller, Get, Post, Body, Patch, Param, Req, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderListDto } from './dto/order-list.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get('list')
  getOrderList(@Query() orderListDto: OrderListDto) {
    return this.orderService.getOrderList(orderListDto);
  }

  @Get('detail/:id')
  getOrderDetail(@Param('id') id: string) {
    return this.orderService.getOrderDetail(+id);
  }

  @Patch('updateOrder')
  updateOrder(@Body() updateOrderDto: UpdateOrderDto, @Req() req) {
    return this.orderService.updateOrder(updateOrderDto, req.user);
  }

  @Get('delete/:id')
  delete(@Param('id') id: string) {
    return this.orderService.delete(+id);
  }
}
