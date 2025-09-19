import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { SafraOrmEntity } from './safra.orm-entity';

@Entity('culturas')
export class CulturaOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column()
  safraId: string;

  @ManyToOne(() => SafraOrmEntity, safra => safra.culturas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'safraId' })
  safra: SafraOrmEntity;
}
