import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RecordModel } from './record.model';

/**
 * @class
 * @name BlockModel
 * @description the block model to store the data
 * @author Mark Leung <leungas@gmail.com>
 */
@Entity({ name: 'blocks' })
export class BlockModel {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  block: number;

  @Column()
  gas: number;

  @Column({ type: 'varchar', array: true, default: [] })
  records: string[];

  @CreateDateColumn()
  createdOn: Date;

  @UpdateDateColumn()
  updatedOn: Date;

  @ManyToOne(() => RecordModel, (record) => record.blocks)
  record: RecordModel;
}
