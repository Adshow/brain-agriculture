import { Produtor } from "../../../domain/entities/produtor.entity";
import { ProdutorOrmEntity } from "../entities/produtor.orm-entity";

export class ProdutorMapper {
  static toOrmEntity(produtor: Produtor): ProdutorOrmEntity {
    const orm = new ProdutorOrmEntity();
    orm.id = produtor.id;
    orm.nome = produtor.nome;
    orm.cpfCnpj = produtor.cpfCnpj;
    return orm;
  }

  static toDomain(orm: ProdutorOrmEntity): Produtor {
    return new Produtor(orm.id, orm.cpfCnpj, orm.nome);
  }
}
