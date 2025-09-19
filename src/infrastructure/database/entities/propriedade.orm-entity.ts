import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ProdutorOrmEntity } from './produtor.orm-entity';
import { SafraOrmEntity } from './safra.orm-entity';

@Entity('propriedades')
export class PropriedadeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column()
  cidade: string;

  @Column()
  estado: string;

  @Column('decimal')
  areaTotal: number;

  @Column('decimal')
  areaAgricultavel: number;

  @Column('decimal')
  areaVegetacao: number;

  @Column()
  produtorId: string;
  @ManyToOne(() => ProdutorOrmEntity, produtor => produtor.propriedades, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'produtorId' })
  produtor: ProdutorOrmEntity;
  
  @OneToMany(() => SafraOrmEntity, safra => safra.propriedade)
  safras: SafraOrmEntity[];
}
