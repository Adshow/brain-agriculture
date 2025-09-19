import { Cultura } from '../../../domain/entities/cultura.entity';
import { CulturaOrmEntity } from '../entities/cultura.orm-entity';

export class CulturaMapper {
  static toDomain(entity: CulturaOrmEntity): Cultura {
    return new Cultura(entity.id, entity.nome, entity.safraId);
  }

  static toDomainList(entities: CulturaOrmEntity[]): Cultura[] {
    return entities.map(this.toDomain);
  }

  static toOrmEntity(cultura: Cultura): CulturaOrmEntity {
    return {
      id: cultura.id,
      nome: cultura.nome,
      safraId: cultura.safraId,
    } as CulturaOrmEntity;
  }
}
