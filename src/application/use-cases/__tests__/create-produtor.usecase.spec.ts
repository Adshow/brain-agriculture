import { CreateProdutorUseCase } from '../produtor/create-produtor.usecase';
import { IProdutorRepository } from '../../../domain/repositories/produtor.repository';
import { BadRequestException, ConflictException } from '@nestjs/common';

describe('CreateProdutorUseCase', () => {
  let useCase: CreateProdutorUseCase;
  let repo: jest.Mocked<IProdutorRepository>;

  beforeEach(() => {
    repo = {
      findByDocumento: jest.fn(),
      create: jest.fn(),
    } as any;
    useCase = new CreateProdutorUseCase(repo);
  });

  it('deve criar produtor válido', async () => {
    repo.findByDocumento.mockResolvedValue(null);
    repo.create.mockImplementation(async (p) => p);

    const result = await useCase.execute({ documento: '12345678909', nome: 'João' });

    expect(result.nome).toBe('João');
    expect(result.cpfCnpj).toBe('12345678909');
    expect(repo.create).toHaveBeenCalledTimes(1);
  });

  it('deve lançar erro se documento inválido', async () => {
    await expect(
      useCase.execute({ documento: '123', nome: 'Maria' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('deve lançar erro se documento já existir', async () => {
    repo.findByDocumento.mockResolvedValue({ id: '1', nome: 'Outro' } as any);

    await expect(
      useCase.execute({ documento: '12345678909', nome: 'João' }),
    ).rejects.toThrow(ConflictException);
  });
});
