import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PropriedadeOrmEntity } from './propriedade.orm-entity';

@Entity('produtores')
export class ProdutorOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  cpfCnpj: string;

  @Column()
  nome: string;

  @OneToMany(() => PropriedadeOrmEntity, propriedade => propriedade.produtor)
  propriedades: PropriedadeOrmEntity[];
}
