import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IProdutorRepository } from '../../../domain/repositories/produtor.repository';
import { Produtor } from '../../../domain/entities/produtor.entity';
import { ProdutorOrmEntity } from '../entities/produtor.orm-entity';
import { ProdutorMapper } from '../mappers/produtor.mapper';

@Injectable()
export class ProdutorTypeOrmRepository implements IProdutorRepository {
  constructor(
    @InjectRepository(ProdutorOrmEntity)
    private readonly repository: Repository<ProdutorOrmEntity>,
  ) { }

  async create(produtor: Produtor): Promise<Produtor> {
    const entity = ProdutorMapper.toOrmEntity(produtor);
    const saved = await this.repository.save(entity);

    return ProdutorMapper.toDomain(saved);
  }

  async update(id: string, data: Partial<Produtor>): Promise<Produtor | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }


  async findAll(): Promise<Produtor[]> {
    const result = await this.repository.find({ relations: ['propriedades'] });
    return result.map(p => new Produtor(p.id, p.cpfCnpj, p.nome));
  }

  async findById(id: string): Promise<Produtor | null> {
    const orm = await this.repository.findOne({ where: { id }, relations: ['propriedades'] });
    return orm ? ProdutorMapper.toDomain(orm) : null;
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findByDocumento(documento: string): Promise<Produtor | null> {
    const normalizedDoc = documento.replace(/\D/g, '');
    return this.repository.findOne({ where: { cpfCnpj: normalizedDoc } });
  }

  async findByIdWithRelations(id: string): Promise<ProdutorOrmEntity | null> {
    return this.repository.findOne({
      where: { id },
      relations: [
        'propriedades',
        'propriedades.safras',
        'propriedades.safras.culturas',
      ],
    });
  }

}
