import { Injectable } from '@nestjs/common';
import { Workbook } from 'exceljs';

export interface ColunmDto {
  header: string;
  key: string;
  width?: number;
}
@Injectable()
export class ExcelService {
  async importExcel(file: Express.Multer.File): Promise<Record<string, string | number>[]> {
    const workBook: Workbook = new Workbook()
    await workBook.xlsx.load(file.buffer)

    const sheet = workBook.worksheets[0]
    const headers: string[] = [];
    const data = [];
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        // 假设第一行是标题行，我们将其存储起来用于映射
        row.eachCell((cell) => {
          headers.push(cell.value.toString());
        });
      } else {
        const obj = {};
        // 不是标题行
        row.eachCell((cell, colNumber) => {
          obj[headers[colNumber - 1]] = cell.value;
        });
        data.push(obj);
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
