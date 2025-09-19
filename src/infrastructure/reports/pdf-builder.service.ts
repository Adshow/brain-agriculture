import { Injectable, BadRequestException, Logger } from '@nestjs/common';

const PdfPrinter = require('pdfmake');

@Injectable()
export class PdfBuilderService {
  private readonly logger = new Logger(PdfBuilderService.name);

  private fonts = {
    Roboto: {
      normal: 'Helvetica',
      bold: 'Helvetica-Bold',
      italics: 'Helvetica-Oblique',
      bolditalics: 'Helvetica-BoldOblique',
    },
  };

  createPdf(docDefinition: any): Promise<Buffer> {
    const printer = new PdfPrinter(this.fonts);
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    const chunks: Buffer[] = [];

    return new Promise((resolve, reject) => {
      pdfDoc.on('data', (chunk) => chunks.push(chunk));
      pdfDoc.on('end', () => {
        this.logger.log('Relatório PDF gerado com sucesso');
        resolve(Buffer.concat(chunks));
      });
      pdfDoc.on('error', (err) => {
        this.logger.error(`Erro na geração do PDF: ${err.message}`);
        reject(new BadRequestException('Erro ao gerar relatório PDF'));
      });
      pdfDoc.end();
    });
  }
}
