import { Injectable } from '@nestjs/common';
import { Workbook } from 'exceljs';

export interface ColunmDto {
  header: string;
  key: string;
  width?: number;
}
@Injectable()
export class ExcelService {
  async importExcel<T>(file: Express.Multer.File): Promise<T> {
    const workBook: Workbook = new Workbook()
    const sheet = workBook.getWorksheet(1)
    await workBook.xlsx.read(file.stream)

    const headers: string[] = [];
    const data: T = Object.create(null);
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        // 假设第一行是标题行，我们将其存储起来用于映射
        row.eachCell((cell) => {
          headers.push(cell.value.toString());
        });
      } else {
        // 不是标题行
        row.eachCell((cell, colNumber) => {
          data[headers[colNumber - 1]] = cell.value;
        });
      }
    });
    return data;
  }

  async exportExcel(colunms: ColunmDto[], data: unknown[], sheetName: string) {
    const workBook = new Workbook();
    const sheet = workBook.addWorksheet(sheetName)
    sheet.columns = colunms;
    data.forEach((row) => {
      sheet.addRow(row);
    })
    return await workBook.xlsx.writeBuffer(); 
  }
}
