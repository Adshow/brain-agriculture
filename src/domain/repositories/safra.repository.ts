import { Safra } from '../entities/safra.entity';

export interface ISafraRepository {
  create(safra: Safra): Promise<Safra>;
  findById(id: string): Promise<Safra | null>;
  findAll(): Promise<Safra[]>;
  findByPropriedade(propriedadeId: string): Promise<Safra[]>;
}
