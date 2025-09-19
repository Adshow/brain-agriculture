import { DashboardResponse } from "../../../modules/dashboard/interfaces/dashboard.interface";

export class ReportDefinitionFactory {
  static create(dados: DashboardResponse, charts: { estado: string; cultura: string; usoSolo: string }) {
    return {
      content: [
        { text: 'Relatório de Dashboard - Agricultura', style: 'header' },
        { text: `Total de Fazendas: ${dados.totalFazendas}` },
        { text: `Total de Hectares: ${dados.totalHectares}` },
        { text: '\n' },

        { text: 'Fazendas por Estado', style: 'subheader' },
        {
          table: {
            body: [
              ['Estado', 'Total'],
              ...dados.porEstado.map((e) => [e.estado, e.total.toString()]),
            ],
          },
        },
        { image: charts.estado, width: 300, alignment: 'center', margin: [0, 15, 0, 15] },

        { text: 'Culturas Plantadas', style: 'subheader' },
        {
          table: {
            body: [
              ['Cultura', 'Total'],
              ...dados.porCultura.map((c) => [c.cultura, c.total.toString()]),
            ],
          },
        },
        { image: charts.cultura, width: 300, alignment: 'center', margin: [0, 15, 0, 15] },

        { text: 'Uso do Solo', style: 'subheader' },
        {
          table: {
            body: [
              ['Tipo', 'Hectares'],
              ...dados.usoSolo.map((u) => [u.tipo, u.hectares.toString()]),
            ],
          },
        },
        { image: charts.usoSolo, width: 300, alignment: 'center', margin: [0, 15, 0, 15] },
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
        subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
      },
    };
  }
}
