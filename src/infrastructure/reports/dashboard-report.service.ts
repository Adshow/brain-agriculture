import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { DashboardResponse } from '../../modules/dashboard/interfaces/dashboard.interface';
import { ChartGeneratorService } from './chart-generator.service';
import { PdfBuilderService } from './pdf-builder.service';
import { ReportDefinitionFactory } from './factory/report-definition.factory';

@Injectable()
export class DashboardReportService {
  private readonly logger = new Logger(DashboardReportService.name);

  constructor(
    private readonly chartGenerator: ChartGeneratorService,
    private readonly pdfBuilder: PdfBuilderService,
  ) {}

  async gerarRelatorio(dados: DashboardResponse): Promise<Buffer> {
    try {
      this.logger.log('Iniciando geração de relatório PDF');

      const charts = {
        estado: await this.chartGenerator.gerarGraficoPizza(
          dados.porEstado.map((e) => e.estado),
          dados.porEstado.map((e) => e.total),
        ),
        cultura: await this.chartGenerator.gerarGraficoPizza(
          dados.porCultura.map((c) => c.cultura),
          dados.porCultura.map((c) => c.total),
        ),
        usoSolo: await this.chartGenerator.gerarGraficoPizza(
          dados.usoSolo.map((u) => u.tipo),
          dados.usoSolo.map((u) => u.hectares),
        ),
      };

      const docDefinition = ReportDefinitionFactory.create(dados, charts);
      return this.pdfBuilder.createPdf(docDefinition);

    } catch (error) {
      this.logger.error(`Erro inesperado: ${error.message}`, error.stack);
      throw new BadRequestException(
        'Erro inesperado ao gerar relatório. Tente novamente mais tarde.',
      );
    }
  }
}
