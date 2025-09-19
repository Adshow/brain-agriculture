import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { PropriedadeOrmEntity } from './propriedade.orm-entity';
import { CulturaOrmEntity } from './cultura.orm-entity';

@Entity('safras')
export class SafraOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column()
  nome: string;

  @Column('int')
  ano: number;
  
  @Column()
  propriedadeId: string;
  
  @ManyToOne(() => PropriedadeOrmEntity, propriedade => propriedade.safras, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'propriedadeId' })
  propriedade: PropriedadeOrmEntity;

  @OneToMany(() => CulturaOrmEntity, cultura => cultura.safra, { cascade: true })
  culturas: CulturaOrmEntity[];
}
