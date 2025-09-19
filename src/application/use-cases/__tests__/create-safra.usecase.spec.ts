import { CreateSafraUseCase } from '../safra/create-safra.usecase';
import { ISafraRepository } from '../../../domain/repositories/safra.repository';
import { IPropriedadeRepository } from '../../../domain/repositories/propriedade.repository';
import { Safra } from '../../../domain/entities/safra.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('CreateSafraUseCase', () => {
  let useCase: CreateSafraUseCase;
  let safraRepo: jest.Mocked<ISafraRepository>;
  let propriedadeRepo: jest.Mocked<IPropriedadeRepository>;

  const request = {
    nome: 'Safra Soja',
    ano: 2025,
    propriedadeId: 'prop-1',
  };

  beforeEach(() => {
    safraRepo = {
      create: jest.fn(),
      findByPropriedade: jest.fn(),
    } as any;

    propriedadeRepo = {
      findById: jest.fn(),
    } as any;

    useCase = new CreateSafraUseCase(safraRepo, propriedadeRepo);
    jest.clearAllMocks();
  });

  it('deve criar safra com sucesso', async () => {
    propriedadeRepo.findById.mockResolvedValue({ id: 'prop-1' } as any);
    safraRepo.findByPropriedade.mockResolvedValue([]);
    
    const saved = new Safra('uuid-123', request.nome, request.ano, request.propriedadeId);
    safraRepo.create.mockResolvedValue(saved);

    const result = await useCase.execute(request);

    expect(propriedadeRepo.findById).toHaveBeenCalledWith('prop-1');
    expect(safraRepo.findByPropriedade).toHaveBeenCalledWith('prop-1');
    expect(safraRepo.create).toHaveBeenCalled();
    expect(result).toBe(saved);
  });

  it('deve lançar NotFoundException se propriedade não existir', async () => {
    propriedadeRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(request)).rejects.toThrow(NotFoundException);
    expect(safraRepo.create).not.toHaveBeenCalled();
  });

  it('deve lançar BadRequestException se safra do mesmo ano já existir', async () => {
    propriedadeRepo.findById.mockResolvedValue({ id: 'prop-1' } as any);
    safraRepo.findByPropriedade.mockResolvedValue([
      new Safra('uuid-old', 'Safra antiga', 2025, 'prop-1'),
    ]);

    await expect(useCase.execute(request)).rejects.toThrow(BadRequestException);
    expect(safraRepo.create).not.toHaveBeenCalled();
  });

  it('deve lançar BadRequestException genérica em erro inesperado', async () => {
    propriedadeRepo.findById.mockResolvedValue({ id: 'prop-1' } as any);
    safraRepo.findByPropriedade.mockResolvedValue([]);
    safraRepo.create.mockRejectedValue(new Error('DB error'));

    await expect(useCase.execute(request)).rejects.toThrow(BadRequestException);
  });
});
