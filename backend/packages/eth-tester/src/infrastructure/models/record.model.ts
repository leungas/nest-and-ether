import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BlockModel } from './block.model';

/**
 * @class
 * @name RecordModel
 * @description the record model to store the data
 * @author Mark Leung <leungas@gmail.com>
 */
@Entity({ name: 'records' })
export class RecordModel {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  year: number;

  @Column()
  month: number;

  @Column()
  day: number;

  @Column()
  starting: number;

  @Column({ nullable: true })
  finishing?: number;

  @CreateDateColumn()
  createdOn: Date;

  @UpdateDateColumn()
  updatedOn: Date;

  @OneToMany(() => BlockModel, (block) => block.record, { nullable: true })
  blocks?: BlockModel[];
}
