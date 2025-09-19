import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISafraRepository } from '../../../domain/repositories/safra.repository';
import { Safra } from '../../../domain/entities/safra.entity';
import { SafraOrmEntity } from '../entities/safra.orm-entity';

@Injectable()
export class SafraTypeOrmRepository implements ISafraRepository {
    constructor(
        @InjectRepository(SafraOrmEntity)
        private readonly repository: Repository<SafraOrmEntity>,
    ) { }

    async create(safra: Safra): Promise<Safra> {
        const entity = this.repository.create({
            nome: safra.nome,
            ano: safra.ano,
            propriedadeId: safra.propriedadeId,
        });

        const saved = await this.repository.save(entity);

        return new Safra(saved.id, saved.nome, saved.ano, saved.propriedadeId);
    }

    async findById(id: string): Promise<Safra | null> {
        const entity = await this.repository.findOne({
            where: { id },
            relations: ['culturas'],
        });

        if (!entity) return null;

        return new Safra(entity.id, entity.nome, entity.ano, entity.propriedadeId);
    }

    async findAll(): Promise<Safra[]> {
        const entities = await this.repository.find({ relations: ['culturas'] });
        return entities.map(e => new Safra(e.id, e.nome, e.ano, e.propriedadeId));
    }

    async findByPropriedade(propriedadeId: string): Promise<Safra[]> {
        const entities = await this.repository.find({ where: { propriedadeId } });
        return entities.map(e => new Safra(e.id, e.nome, e.ano, e.propriedadeId));
    }

}
