import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPropriedadeRepository } from '../../../domain/repositories/propriedade.repository';
import { Propriedade } from '../../../domain/entities/propriedade.entity';
import { PropriedadeOrmEntity } from '../entities/propriedade.orm-entity';

@Injectable()
export class PropriedadeTypeOrmRepository implements IPropriedadeRepository {
  constructor(
    @InjectRepository(PropriedadeOrmEntity)
    private readonly repository: Repository<PropriedadeOrmEntity>,
  ) { }

  async create(propriedade: Propriedade): Promise<Propriedade> {
    const entity = this.repository.create({
      ...propriedade,
      produtorId: propriedade.produtorId,
    });
    const saved = await this.repository.save(entity);
    return new Propriedade(
      saved.id,
      saved.nome,
      saved.cidade,
      saved.estado,
      Number(saved.areaTotal),
      Number(saved.areaAgricultavel),
      Number(saved.areaVegetacao),
      saved.produtorId,
    );
  }


  async findById(id: string): Promise<Propriedade | null> {
    return this.repository.findOne({ where: { id }, relations: ['safras'] });
  }

  async findAll(): Promise<Propriedade[]> {
    return this.repository.find({ relations: ['safras'] });
  }
}
