import { DeleteProdutorUseCase } from '../produtor/delete-produtor.usecase';
import { IProdutorRepository } from '../../../domain/repositories/produtor.repository';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('DeleteProdutorUseCase', () => {
  let useCase: DeleteProdutorUseCase;
  let repo: jest.Mocked<IProdutorRepository>;

  beforeEach(() => {
    repo = {
      findById: jest.fn(),
      remove: jest.fn(),
    } as any;

    useCase = new DeleteProdutorUseCase(repo);
  });

  it('deve remover produtor existente', async () => {
    repo.findById.mockResolvedValue({ id: '123', nome: 'João' } as any);
    repo.remove.mockResolvedValue(undefined);

    const result = await useCase.execute('123');

    expect(repo.findById).toHaveBeenCalledWith('123');
    expect(repo.remove).toHaveBeenCalledWith('123');
    expect(result).toEqual({ message: 'Produtor removido com sucesso' });
  });

  it('deve lançar NotFoundException se produtor não existir', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(useCase.execute('999')).rejects.toThrow(NotFoundException);
    expect(repo.findById).toHaveBeenCalledWith('999');
    expect(repo.remove).not.toHaveBeenCalled();
  });

  it('deve lançar BadRequestException se ocorrer erro inesperado', async () => {
    repo.findById.mockResolvedValue({ id: '123', nome: 'João' } as any);
    repo.remove.mockRejectedValue(new Error('Falha no banco'));

    await expect(useCase.execute('123')).rejects.toThrow(BadRequestException);
    expect(repo.findById).toHaveBeenCalledWith('123');
    expect(repo.remove).toHaveBeenCalledWith('123');
  });
});
