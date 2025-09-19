import { Propriedade } from '../entities/propriedade.entity';

export interface IPropriedadeRepository {
  create(propriedade: Propriedade): Promise<Propriedade>;
  findById(id: string): Promise<Propriedade | null>;
  findAll(): Promise<Propriedade[]>;
}
