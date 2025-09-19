import { BadRequestException, Logger } from '@nestjs/common';
import { IPropriedadeRepository } from '../../../domain/repositories/propriedade.repository';
import { ICulturaRepository } from '../../../domain/repositories/cultura.repository';
import { UseCaseBase } from '../base.usecase';
import { DashboardResponse } from '../../../modules/dashboard/interfaces/dashboard.interface';

export class GetDashboardUseCase extends UseCaseBase<void, DashboardResponse> {
    private readonly logger = new Logger(GetDashboardUseCase.name);

    constructor(
        private readonly propriedadeRepository: IPropriedadeRepository,
        private readonly culturaRepository: ICulturaRepository,
    ) {
        super();
    }

    async execute(): Promise<DashboardResponse> {
        try {
            this.logger.log('Iniciando cálculo do dashboard');

            const propriedades = await this.propriedadeRepository.findAll();
            const culturas = await this.culturaRepository.findAll();

            const result: DashboardResponse = {
                totalFazendas: propriedades.length,
                totalHectares: this.calcularTotalHectares(propriedades),
                porEstado: this.calcularPorEstado(propriedades),
                porCultura: this.calcularPorCultura(culturas),
                usoSolo: this.calcularUsoSolo(propriedades),
            };

            this.logger.log('Dashboard calculado com sucesso');
            return result;
        } catch (error) {
            this.logger.error(`Erro ao calcular dashboard: ${error.message}`, error.stack);

            throw new BadRequestException(
                'Erro inesperado ao calcular dashboard. Tente novamente mais tarde.',
            );
        }
    }

    private calcularTotalHectares(propriedades: any[]): number {
        return propriedades.reduce((sum, p) => sum + Number(p.areaTotal), 0);
    }

    private calcularPorEstado(propriedades: any[]): { estado: string; total: number }[] {
        const map = propriedades.reduce((acc, p) => {
            acc[p.estado] = (acc[p.estado] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(map).map(([estado, total]) => ({
            estado,
            total: Number(total),
        }));
    }

    private calcularPorCultura(culturas: any[]): { cultura: string; total: number }[] {
        const map = culturas.reduce((acc, c) => {
            acc[c.nome] = (acc[c.nome] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(map).map(([cultura, total]) => ({
            cultura,
            total: Number(total),
        }));
    }


    private calcularUsoSolo(propriedades: any[]): { tipo: string; hectares: number }[] {
        const agricultavel = propriedades.reduce((sum, p) => sum + Number(p.areaAgricultavel), 0);
        const vegetacao = propriedades.reduce((sum, p) => sum + Number(p.areaVegetacao), 0);

        return [
            { tipo: 'Agricultável', hectares: agricultavel },
            { tipo: 'Vegetação', hectares: vegetacao },
        ];
    }
}
