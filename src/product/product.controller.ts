import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductListDto } from './dto/product-list.dto';
import { HotSalesService } from './hot-sales.service';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly hotSalesService: HotSalesService,
  ) {}

  @Post('create')
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get('list')
  getProductList(@Query() productListDto: ProductListDto) {
    return this.productService.getProductList(productListDto);
  }

  @Get('hot-list')
  getHotSaleProductList(@Query() productListDto: ProductListDto) {
    return this.hotSalesService.getTopNProducts(productListDto.topN);
  }

  @Patch('edit')
  update(@Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(updateProductDto);
  }

  @Get('delete/:id')
  delete(@Param('id') id: number) {
    return this.productService.delete(id);
  }

  @Patch('updateStatus')
  updateStatus(@Body() updateProductDto: UpdateProductDto) {
    return this.productService.updateStatus(
      updateProductDto.id,
      updateProductDto.status,
    );
  }
}
