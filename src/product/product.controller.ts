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
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductListDto } from './dto/product-list.dto';
import { HotSalesService } from './hot-sales.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelService } from 'src/common/excel/excel.service';
import { Response } from 'express';

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
  @UseInterceptors(FileInterceptor('file'))
  async importProducts(@UploadedFile() file: Express.Multer.File) {
    const data = await this.excelService.importExcel(file);
    console.log(data);
    return {
      message: '上传成功',
      file: file.filename,
      data
    };
  }

  @Post('export')
  async exportProducts(@Res() res: Response) {
    // 定义列
    const columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 32 },
      { header: 'Email', key: 'email', width: 32 },
    ];

    // 查询数据库或获取数据
    const data = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
    ];
    // 导出数据到Excel
    const buffer = await this.excelService.exportExcel(columns, data, '产品');

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="users.xlsx"');

    return res.send(buffer);
  }
  
}
