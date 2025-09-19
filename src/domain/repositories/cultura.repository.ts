import { Cultura } from '../entities/cultura.entity';

export interface ICulturaRepository {
  bulkCreate(culturas: Cultura[]): Promise<Cultura[]>;
  findBySafra(safraId: string): Promise<Cultura[]>;
  findById(id: string): Promise<Cultura | null>;
  findAll(): Promise<Cultura[]>;
}
