import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { GetDashboardUseCase } from '../../application/use-cases/dashboard/get-dashboard.usecase';
import { DashboardReportService } from '../../infrastructure/reports/dashboard-report.service';
import type { Response } from 'express';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly getDashboard: GetDashboardUseCase,
    private readonly reportService: DashboardReportService,
  ) {}

  @Get('relatorio')
  @ApiResponse({
    status: 200,
    description: 'Relatório em PDF gerado com sucesso',
    content: { 'application/pdf': { schema: { type: 'string', format: 'binary' } } },
  })
  async gerarRelatorio(@Res() res: Response): Promise<void> {
    const dados = await this.getDashboard.execute();
    const pdfBuffer = await this.reportService.gerarRelatorio(dados);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="dashboard.pdf"',
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }
}
