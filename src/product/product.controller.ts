import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductListDto } from './dto/product-list.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get('list')
  getProductList(@Query() productListDto: ProductListDto) {
    return this.productService.getProductList(productListDto);
  }

  @Patch('edit')
  update(@Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(updateProductDto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.productService.delete(id);
  }

  @Patch('updateStatus')
  updateStatus(@Body() updateProductDto: UpdateProductDto) {
    return this.productService.updateStatus(updateProductDto.id, updateProductDto.status);
  }
}
