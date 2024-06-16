import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Like, Repository } from 'typeorm';
import { ProductListDto } from './dto/product-list.dto';

@Injectable()
export class ProductService {
  @InjectRepository(ProductEntity)
  private productRepository: Repository<ProductEntity>

  /**
   * 创建商品
   *
   * @param createProductDto 创建商品的DTO
   * @returns 返回创建成功的消息
   * @throws 当创建失败时，抛出HttpException异常
   */
  async create(createProductDto: CreateProductDto) {
    const product = await this.productRepository.save(createProductDto)
    if (!product) {
      throw new HttpException('创建失败，请稍后重试', HttpStatus.EXPECTATION_FAILED)
    }
    return '创建成功'
  }

  /**
   * 获取产品列表
   *
   * @param productListDto 产品列表DTO
   * @returns 返回产品列表和总数
   */
  async getProductList(productListDto: ProductListDto) {
    const { name, status, page, pageSize } = productListDto
    const where = {
      ...(name ? { name: Like(`%${name}%`) } : null),
      ...(status ? { status } : null),
    }
    const [list, total] = await this.productRepository.findAndCount({
      where,
      order: { id: 'DESC' },
      skip: pageSize * (page - 1),
      take: pageSize,
    });
    return {
      list,
      total
    }
  }


  /**
   * 更新商品信息
   *
   * @param updateProductDto 更新商品信息所需的数据传输对象
   * @returns 返回更新成功的信息
   * @throws 如果商品不存在或已删除，则抛出 HttpException 异常
   * @throws 如果更新失败，则抛出 HttpException 异常
   */
  async update(updateProductDto: UpdateProductDto) {
    const { id } = updateProductDto
    const exists = await this.productRepository.findOneBy({ id });
    if (!exists) {
      throw new HttpException('商品不存在或已删除', HttpStatus.EXPECTATION_FAILED)
    }
    const { affected } = await this.productRepository.update({ id }, updateProductDto)
    if (!affected) {
      throw new HttpException('更新失败，请稍后重试', HttpStatus.EXPECTATION_FAILED)
    }
    return '更新成功';
  }

  /**
   * 删除商品
   *
   * @param id 商品ID
   * @returns 返回删除结果，成功返回'删除成功'，失败抛出异常
   * @throws 当商品不存在或已删除时，抛出 HttpException 异常，状态码为 HttpStatus.EXPECTATION_FAILED
   * @throws 当删除失败时，抛出 HttpException 异常，状态码为 HttpStatus.EXPECTATION_FAILED
   */
  async delete(id: number) {
    const exists = await this.productRepository.findOneBy({ id });
    if (!exists) {
      throw new HttpException('商品不存在或已删除', HttpStatus.EXPECTATION_FAILED)
    }
    const { affected } = await this.productRepository.delete({ id })
    if (!affected) {
      throw new HttpException('删除失败，请稍后重试', HttpStatus.EXPECTATION_FAILED)
    }
    return '删除成功';
  }

  /**
   * 更新商品状态
   *
   * @param id 商品ID
   * @param status 商品状态，1表示上架，2表示下架
   * @returns 返回一个字符串，表示上架或下架是否成功
   * @throws 如果商品不存在或已删除，则抛出HttpException异常
   * @throws 如果更新状态失败，则抛出HttpException异常
   */
  async updateStatus(id: number, status: 1 | 2) {
    const exists = await this.productRepository.findOneBy({ id });
    if (!exists) {
      throw new HttpException('商品不存在或已删除', HttpStatus.EXPECTATION_FAILED)
    }
    const { affected } = await this.productRepository.update({ id }, { status })
    const text = status === 1 ? '上架' : '下架'
    if (!affected) {
      throw new HttpException(`${text}失败，请稍后重试`, HttpStatus.EXPECTATION_FAILED)
    }
    return `${text}成功`;
  }
}
