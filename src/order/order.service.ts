import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { OrderEntity } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { OrderListDto } from './dto/order-list.dto';
import { ProductEntity } from 'src/product/entities/product.entity';
import { HotSalesService } from 'src/product/hot-sales.service';

@Injectable()
export class OrderService {
  @InjectRepository(OrderEntity)
  private orderRepository: Repository<OrderEntity>

  @InjectRepository(ProductEntity)
  private productRepository: Repository<ProductEntity>

  @Inject(HotSalesService)
  private hotSalesService: HotSalesService

  /**
   * 创建订单
   *
   * @param createOrderDto 创建订单所需参数
   * @returns 返回成功信息
   * @throws HttpException 抛出HTTP异常
   */
  async create(createOrderDto: CreateOrderDto) {
    const { productId, discount = 1, status = 0, count } = createOrderDto
    // 获取商品信息
    const product = await this.productRepository.findOneBy({ id: productId })
    if (!product) {
      throw new HttpException('商品不存在', HttpStatus.NOT_FOUND)
    }
    // 获取开单商品计算价格
    let totalPrice = product.price * count
    let discountPrice = totalPrice * discount
    let orderItem =  {
      ...createOrderDto,
      name: product.name,
      price: totalPrice,
      status,
      count,
      productId,
      discountPrice,
      discount
    }
    const order = await this.orderRepository.save(plainToClass(OrderEntity, orderItem))
    if (!order) {
      throw new HttpException('开单失败', HttpStatus.INTERNAL_SERVER_ERROR)
    }
    // 缓存销量到Redis做排行榜
    await this.hotSalesService.addProductSales(String(productId), count)
    return '开单成功';
  }

  /**
   * 获取订单列表
   *
   * @param orderListDto 订单列表DTO
   * @returns 返回一个包含订单列表和总条数的对象
   */
  async getOrderList(orderListDto: OrderListDto) {
    const { page, pageSize, id, status } = orderListDto
    const where = {
      ...(id ? { id } : null),
      ...(status ? { status } : null)
    }
    const [list, total] = await this.orderRepository.findAndCount({
      where,
      order: { id: 'DESC' },
      skip: pageSize * (page - 1),
      take: pageSize
    });
    return {
      list,
      total
    }
  }

  /**
   * 获取订单详情
   *
   * @param id 订单ID
   * @returns 返回订单详情对象，包含订单信息和商品信息
   * @throws 当订单不存在时，抛出 HttpException 异常，状态码为 NOT_FOUND
   * @throws 当查询订单商品失败时，抛出 HttpException 异常，状态码为 NOT_FOUND
   */
  async getOrderDetail(id: number) {
    const order = await this.orderRepository.findOneBy({ id })
    if (!order) {
      throw new HttpException('订单不存在', HttpStatus.NOT_FOUND)
    }
    const product = await this.productRepository.findOneBy({ id: order.productId })
    if (!product) {
      throw new HttpException('查询订单商品失败', HttpStatus.NOT_FOUND)
    }
    return {
      ...order,
      product
    };
  }

  /**
   * 更新订单状态及描述
   *
   * @param updateOrderDto 更新订单信息
   * @param currentUser 当前用户信息
   * @returns 返回更新结果
   * @throws 当订单不存在或已删除时，抛出 HttpException 异常，状态码为 NOT_FOUND
   * @throws 当修改失败时，抛出 HttpException 异常，状态码为 INTERNAL_SERVER_ERROR
   */
  async updateOrder(updateOrderDto: UpdateOrderDto, currentUser: UserEntity) {
    const { id, status, desc = '' } = updateOrderDto
    const exists = this.orderRepository.findOneBy({ id })
    if (!exists) {
      throw new HttpException('订单不存在或已删除', HttpStatus.NOT_FOUND);
    }
    const { affected } = await this.orderRepository.update({ id }, { status, desc })
    if (!affected) {
      throw new HttpException('修改失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return '修改成功';
  }

  /**
   * 删除订单
   *
   * @param id 订单ID
   * @param currentUser 当前用户
   * @returns 删除成功或失败的信息
   * @throws 如果订单不存在或已删除，则抛出404错误；如果删除失败，则抛出500错误
   */
  async delete(id: number) {
    const exists = await this.orderRepository.findOneBy({ id })
    if (!exists) {
      throw new HttpException('订单不存在或已删除', HttpStatus.NOT_FOUND);
    }
    const { affected } = await this.orderRepository.delete({ id })
    if (!affected) {
      throw new HttpException('删除失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return '删除成功';
  }
}
