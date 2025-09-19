import { FindProdutorByIdUseCase } from '../produtor/find-produtor-by-id.usecase';
import { IProdutorRepository } from '../../../domain/repositories/produtor.repository';
import { Produtor } from '../../../domain/entities/produtor.entity';
import { NotFoundException } from '@nestjs/common';

describe('FindProdutorByIdUseCase', () => {
  let useCase: FindProdutorByIdUseCase;
  let repo: jest.Mocked<IProdutorRepository>;

  beforeEach(() => {
    repo = {
      findByIdWithRelations: jest.fn(),
    } as any;

    useCase = new FindProdutorByIdUseCase(repo);
  });

  it('deve retornar produtor quando encontrado', async () => {
    const produtorMock = new Produtor('uuid-1', '12345678909', 'João');
    repo.findByIdWithRelations.mockResolvedValue(produtorMock as any);

    const result = await useCase.execute('uuid-1');

    expect(result).toBe(produtorMock);
    expect(repo.findByIdWithRelations).toHaveBeenCalledWith('uuid-1');
  });

  it('deve lançar NotFoundException quando produtor não existe', async () => {
    repo.findByIdWithRelations.mockResolvedValue(null);

    await expect(useCase.execute('uuid-404')).rejects.toThrow(NotFoundException);
    expect(repo.findByIdWithRelations).toHaveBeenCalledWith('uuid-404');
  });
});
