import { UpdateProdutorUseCase } from '../produtor/update-produtor.usecase';
import { IProdutorRepository } from '../../../domain/repositories/produtor.repository';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Produtor } from '../../../domain/entities/produtor.entity';

jest.mock('../../../shared/validators/document.validator', () => ({
  DocumentValidator: {
    isValid: jest.fn(),
  },
}));

import { DocumentValidator } from '../../../shared/validators/document.validator';

describe('UpdateProdutorUseCase', () => {
  let useCase: UpdateProdutorUseCase;
  let repo: jest.Mocked<IProdutorRepository>;

  beforeEach(() => {
    repo = {
      findById: jest.fn(),
      update: jest.fn(),
    } as any;

    useCase = new UpdateProdutorUseCase(repo);
    jest.clearAllMocks();
  });

  it('deve atualizar produtor existente (nome)', async () => {
    const produtor = new Produtor('uuid-1', '12345678909', 'João');
    repo.findById.mockResolvedValueOnce(produtor).mockResolvedValueOnce({
      ...produtor,
      nome: 'João Atualizado',
    });

    const result = await useCase.execute({
      id: 'uuid-1',
      data: { nome: 'João Atualizado' },
    });

    expect(repo.findById).toHaveBeenCalledWith('uuid-1');
    expect(repo.update).toHaveBeenCalledWith('uuid-1', { nome: 'João Atualizado' });
    expect(result?.nome).toBe('João Atualizado');
  });

  it('deve lançar NotFoundException se produtor não existir', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({ id: 'uuid-404', data: { nome: 'Teste' } }),
    ).rejects.toThrow(NotFoundException);

    expect(repo.update).not.toHaveBeenCalled();
  });

  it('deve lançar BadRequestException se CPF/CNPJ inválido', async () => {
    const produtor = new Produtor('uuid-1', '12345678909', 'João');
    repo.findById.mockResolvedValue(produtor);

    (DocumentValidator.isValid as jest.Mock).mockReturnValue(false);

    await expect(
      useCase.execute({ id: 'uuid-1', data: { cpfCnpj: '11111111111' } }),
    ).rejects.toThrow(BadRequestException);

    expect(repo.update).not.toHaveBeenCalled();
  });

  it('deve lançar BadRequestException genérica em erro inesperado', async () => {
    const produtor = new Produtor('uuid-1', '12345678909', 'João');
    repo.findById.mockResolvedValue(produtor);
    repo.update.mockRejectedValue(new Error('DB error'));

    (DocumentValidator.isValid as jest.Mock).mockReturnValue(true);

    await expect(
      useCase.execute({ id: 'uuid-1', data: { cpfCnpj: '12345678909' } }),
    ).rejects.toThrow(BadRequestException);
  });
});
