import { AddCulturasUseCase } from '../cultura/add-cultura.usecase';
import { ISafraRepository } from '../../../domain/repositories/safra.repository';
import { ICulturaRepository } from '../../../domain/repositories/cultura.repository';
import { Cultura } from '../../../domain/entities/cultura.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('AddCulturasUseCase', () => {
  let useCase: AddCulturasUseCase;
  let safraRepo: jest.Mocked<ISafraRepository>;
  let culturaRepo: jest.Mocked<ICulturaRepository>;

  const request = {
    safraId: 'safra-1',
    nomesCulturas: ['Soja', 'Milho'],
  };

  beforeEach(() => {
    safraRepo = {
      findById: jest.fn(),
    } as any;

    culturaRepo = {
      bulkCreate: jest.fn(),
    } as any;

    useCase = new AddCulturasUseCase(safraRepo, culturaRepo);
    jest.clearAllMocks();
  });

  it('deve adicionar culturas com sucesso', async () => {
    safraRepo.findById.mockResolvedValue({ id: 'safra-1' } as any);

    const savedCulturas = [
      new Cultura('uuid-1', 'Soja', 'safra-1'),
      new Cultura('uuid-2', 'Milho', 'safra-1'),
    ];
    culturaRepo.bulkCreate.mockResolvedValue(savedCulturas);

    const result = await useCase.execute(request);

    expect(safraRepo.findById).toHaveBeenCalledWith('safra-1');
    expect(culturaRepo.bulkCreate).toHaveBeenCalled();
    expect(result).toEqual(savedCulturas);
  });

  it('deve lançar NotFoundException se safra não existir', async () => {
    safraRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(request)).rejects.toThrow(NotFoundException);
    expect(culturaRepo.bulkCreate).not.toHaveBeenCalled();
  });

  it('deve lançar BadRequestException se nenhuma cultura for informada', async () => {
    safraRepo.findById.mockResolvedValue({ id: 'safra-1' } as any);

    await expect(
      useCase.execute({ safraId: 'safra-1', nomesCulturas: [] }),
    ).rejects.toThrow(BadRequestException);

    expect(culturaRepo.bulkCreate).not.toHaveBeenCalled();
  });

  it('deve lançar BadRequestException genérica em erro inesperado', async () => {
    safraRepo.findById.mockResolvedValue({ id: 'safra-1' } as any);
    culturaRepo.bulkCreate.mockRejectedValue(new Error('DB error'));

    await expect(useCase.execute(request)).rejects.toThrow(BadRequestException);
  });
});
