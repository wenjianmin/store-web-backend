import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  async create(createProductDto: CreateProductDto) {
    const result = await this.productRepository.save(createProductDto)
    if (!result) {
      throw new HttpException('创建失败，请稍后重试', HttpStatus.EXPECTATION_FAILED)
    }
    return '创建成功'
  }

  async getProductList(productListDto: ProductListDto) {
    const { name, status, page, pageSize } = productListDto
    const where = {
      ...(name ? { name: Like(`%${name}%`) } : null),
      ...(status ? { status } : null),
    }
    return await this.productRepository.findAndCount({
      where,
      order: { id: 'DESC' },
      skip: pageSize * (page - 1),
      take: pageSize,
    });
  }


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
