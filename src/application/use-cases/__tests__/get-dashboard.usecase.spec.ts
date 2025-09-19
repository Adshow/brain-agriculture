import { GetDashboardUseCase } from '../dashboard/get-dashboard.usecase';
import { IPropriedadeRepository } from 'src/domain/repositories/propriedade.repository';
import { ICulturaRepository } from 'src/domain/repositories/cultura.repository';
import { BadRequestException } from '@nestjs/common';

describe('GetDashboardUseCase', () => {
  let useCase: GetDashboardUseCase;
  let propriedadeRepo: jest.Mocked<IPropriedadeRepository>;
  let culturaRepo: jest.Mocked<ICulturaRepository>;

  beforeEach(() => {
    propriedadeRepo = {
      findAll: jest.fn(),
    } as any;

    culturaRepo = {
      findAll: jest.fn(),
    } as any;

    useCase = new GetDashboardUseCase(propriedadeRepo, culturaRepo);
  });

  it('deve calcular corretamente o dashboard', async () => {
    propriedadeRepo.findAll.mockResolvedValue([
      {
        id: 'p1',
        nome: 'Fazenda 1',
        cidade: 'Salvador',
        estado: 'BA',
        areaTotal: 100,
        areaAgricultavel: 60,
        areaVegetacao: 40,
        produtorId: 'prod1',
      },
      {
        id: 'p2',
        nome: 'Fazenda 2',
        cidade: 'São Paulo',
        estado: 'SP',
        areaTotal: 200,
        areaAgricultavel: 120,
        areaVegetacao: 80,
        produtorId: 'prod2',
      },
    ]);

    culturaRepo.findAll.mockResolvedValue([
      { id: 'c1', nome: 'Soja', safraId: 's1' },
      { id: 'c2', nome: 'Milho', safraId: 's2' },
      { id: 'c3', nome: 'Soja', safraId: 's1' },
    ]);

    const result = await useCase.execute();

    expect(result.totalFazendas).toBe(2);
    expect(result.totalHectares).toBe(300);

    expect(result.porEstado).toEqual(
      expect.arrayContaining([
        { estado: 'BA', total: 1 },
        { estado: 'SP', total: 1 },
      ]),
    );

    expect(result.porCultura).toEqual(
      expect.arrayContaining([
        { cultura: 'Soja', total: 2 },
        { cultura: 'Milho', total: 1 },
      ]),
    );

    expect(result.usoSolo).toEqual([
      { tipo: 'Agricultável', hectares: 180 },
      { tipo: 'Vegetação', hectares: 120 },
    ]);
  });

  it('deve lançar BadRequestException se ocorrer erro inesperado', async () => {
    propriedadeRepo.findAll.mockRejectedValue(new Error('DB error'));

    await expect(useCase.execute()).rejects.toThrow(BadRequestException);
  });
});
