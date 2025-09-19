import { Injectable } from '@nestjs/common';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { ChartConfiguration } from 'chart.js';

@Injectable()
export class ChartGeneratorService {
  private chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 400, height: 400 });

  async gerarGraficoPizza(labels: string[], data: number[]): Promise<string> {
    const configuration: ChartConfiguration<'pie'> = {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: [
              '#4CAF50',
              '#FF9800',
              '#2196F3',
              '#9C27B0',
              '#E91E63',
              '#00BCD4',
            ],
          },
        ],
      },
    };

    const image = await this.chartJSNodeCanvas.renderToBuffer(configuration);
    return `data:image/png;base64,${image.toString('base64')}`;
  }
}
