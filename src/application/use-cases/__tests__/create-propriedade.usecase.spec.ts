import { CreatePropriedadeUseCase } from '../propriedade/create-propriedade.usecase';
import { IPropriedadeRepository } from '../../../domain/repositories/propriedade.repository';
import { IProdutorRepository } from '../../../domain/repositories/produtor.repository';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Propriedade } from '../../../domain/entities/propriedade.entity';

describe('CreatePropriedadeUseCase', () => {
  let useCase: CreatePropriedadeUseCase;
  let propriedadeRepo: jest.Mocked<IPropriedadeRepository>;
  let produtorRepo: jest.Mocked<IProdutorRepository>;

  const request = {
    nome: 'Fazenda Boa Vista',
    cidade: 'Salvador',
    estado: 'BA',
    areaTotal: 100,
    areaAgricultavel: 60,
    areaVegetacao: 40,
    produtorId: 'produtor-1',
  };

  beforeEach(() => {
    propriedadeRepo = {
      create: jest.fn(),
    } as any;

    produtorRepo = {
      findById: jest.fn(),
    } as any;

    useCase = new CreatePropriedadeUseCase(propriedadeRepo, produtorRepo);
    jest.clearAllMocks();
  });

  it('deve criar propriedade com sucesso', async () => {
    produtorRepo.findById.mockResolvedValue({ id: 'produtor-1' } as any);

    const saved = new Propriedade(
      'uuid-123',
      request.nome,
      request.cidade,
      request.estado,
      request.areaTotal,
      request.areaAgricultavel,
      request.areaVegetacao,
      request.produtorId,
    );

    propriedadeRepo.create.mockResolvedValue(saved);

    const result = await useCase.execute(request);

    expect(produtorRepo.findById).toHaveBeenCalledWith('produtor-1');
    expect(propriedadeRepo.create).toHaveBeenCalled();
    expect(result).toBe(saved);
  });

  it('deve lançar NotFoundException se produtor não existir', async () => {
    produtorRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(request)).rejects.toThrow(NotFoundException);
    expect(propriedadeRepo.create).not.toHaveBeenCalled();
  });

  it('deve lançar BadRequestException se áreas forem inválidas', async () => {
    produtorRepo.findById.mockResolvedValue({ id: 'produtor-1' } as any);

    await expect(
      useCase.execute({ ...request, areaAgricultavel: 90, areaVegetacao: 20 }),
    ).rejects.toThrow(BadRequestException);

    expect(propriedadeRepo.create).not.toHaveBeenCalled();
  });

  it('deve lançar BadRequestException genérica em erro inesperado', async () => {
    produtorRepo.findById.mockResolvedValue({ id: 'produtor-1' } as any);
    propriedadeRepo.create.mockRejectedValue(new Error('DB error'));

    await expect(useCase.execute(request)).rejects.toThrow(BadRequestException);
  });
});
