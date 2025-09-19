import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICulturaRepository } from '../../../domain/repositories/cultura.repository';
import { Cultura } from '../../../domain/entities/cultura.entity';
import { CulturaOrmEntity } from '../entities/cultura.orm-entity';
import { CulturaMapper } from '../mappers/cultura.mapper';

@Injectable()
export class CulturaTypeOrmRepository implements ICulturaRepository {
  constructor(
    @InjectRepository(CulturaOrmEntity)
    private readonly repository: Repository<CulturaOrmEntity>,
  ) { }

  async bulkCreate(culturas: Cultura[]): Promise<Cultura[]> {
    const entities = culturas.map(CulturaMapper.toOrmEntity);
    const saved = await this.repository.save(entities);
    return CulturaMapper.toDomainList(saved);
  }

  async findBySafra(safraId: string): Promise<Cultura[]> {
    const entities = await this.repository.find({ where: { safraId } });
    return CulturaMapper.toDomainList(entities);
  }

   async findById(id: string): Promise<Cultura | null> {
    const found = await this.repository.findOne({ where: { id } });
    return found ? new Cultura(found.id, found.nome, found.safraId) : null;
  }

  async findAll(): Promise<Cultura[]> {
    const entities = await this.repository.find();
    return entities.map((c) => new Cultura(c.id, c.nome, c.safraId));
  }
}
