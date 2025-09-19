import { ProdutorOrmEntity } from '../../infrastructure/database/entities/produtor.orm-entity';
import { Produtor } from '../entities/produtor.entity';

export interface IProdutorRepository {
  create(produtor: Produtor): Promise<Produtor>;
  findById(id: string): Promise<Produtor | null>;
  update(id: string, data: Partial<Produtor>): Promise<Produtor | null>;
  findAll(): Promise<Produtor[]>;
  remove(id: string): Promise<void>;
  findByDocumento(documento: string): Promise<Produtor | null>;
  findByIdWithRelations(id: string): Promise<ProdutorOrmEntity | null>;
}
