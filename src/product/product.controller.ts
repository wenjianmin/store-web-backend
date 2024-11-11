import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductListDto } from './dto/product-list.dto';
import { HotSalesService } from './hot-sales.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelService } from 'src/common/excel/excel.service';
import { Response } from 'express';
import { AllowNoToken } from 'src/common/decorators/token.decorator';
import { FileLoggingInterceptor } from 'src/common/file.interceptor';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly hotSalesService: HotSalesService,
    private readonly excelService: ExcelService,
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
  @Post('import')
  @UseInterceptors(FileInterceptor('file'), FileLoggingInterceptor)
  async importProducts(@UploadedFile() file: Express.Multer.File) {
    const data = await this.excelService.importExcel(file);
    await this.productService.importProducts(data);
    return {
      message: '上传成功',
      file: file.filename,
      data,
    };
  }

  @Get('export')
  @AllowNoToken()
  async exportProducts(@Res() res: Response) {
    // 定义列
    const columns = [
      { header: 'id', key: 'id', width: 10 },
      { header: 'name', key: 'name', width: 32 },
      { header: 'price', key: 'price', width: 32 },
      { header: 'desc', key: 'desc', width: 32 },
      { header: 'createTime', key: 'createTime', width: 32 },
    ];

    // 查询数据库或获取数据
    const { list } = await this.productService.getProductList();
    // 导出数据到Excel
    const buffer = await this.excelService.exportExcel(columns, list, '产品');

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename*=UTF-8''${encodeURIComponent('产品数据.xlsx')}`,
    );

    return res.send(buffer);
  }
}
