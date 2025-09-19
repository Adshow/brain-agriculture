export interface DashboardResponse {
  totalFazendas: number;
  totalHectares: number;
  porEstado: { estado: string; total: number }[];
  porCultura: { cultura: string; total: number }[];
  usoSolo: { tipo: string; hectares: number }[];
}
