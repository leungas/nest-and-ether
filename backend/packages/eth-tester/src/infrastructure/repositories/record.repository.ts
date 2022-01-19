import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { WinstonLogger, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Record } from '../../domain/entities/record.entity';
import { Connection, EntityManager } from 'typeorm';
import { RecordModel } from '../models/record.model';
import { BlockModel } from '../models/block.model';
import { Block } from '../../domain/entities/block.entity';

/**
 * @class
 * @name RecordRepository
 * @description the data link layer for records
 * @author Mark Leung <leungas@gmail.com>
 */
@Injectable()
export class RecordRepository {
  /**
   * @constructor
   * @param logger {WinstonLogger} the console logger
   * @param connection {Connection} the TypeORM connection
   */
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: WinstonLogger,
    private readonly connection: Connection,
  ) {}

  /**
   * @method create
   * @description creating a new record
   * @param entity {Record} the record entity to record
   * @return {Promise<void>}
   */
  async create(entity: Record) {
    this.logger.debug(`Repo(Record)->create(): Enter`);
    this.logger.debug(
      `Repo(Record)->create()->$entity: ${JSON.stringify(entity)}`,
    );
    this.connection.transaction(async (em: EntityManager) => {
      const model = this.import(entity);
      await em.save(model);
    });
  }

  /**
   * @method export
   * @description converting model from data to domain layer
   * @param model {RecordModel} the data layer model
   * @returns {Record}
   */
  export(model: RecordModel) {
    this.logger.debug(`Repo(Record)->export(): Enter`);
    this.logger.debug(
      `Repo(Record)->export()->$model: ${JSON.stringify(model)}`,
    );
    return new Record(
      model.year,
      model.month,
      model.day,
      model.starting,
      model.finishing,
      model.blocks?.map((b) => new Block(b.block, b.gas, b.records)),
    );
  }

  /**
   * @method find
   * @description this is our domain layer get
   * @param year {number} the year of the record
   * @param month {number} the month of the record
   * @param day {number} the day of the record
   * @returns {Promise<Record>}
   */
  async find(year: number, month: number, day: number) {
    this.logger.debug(`Repo(Record)->find(): Enter`);
    this.logger.debug(`Repo(Record)->find()->$year: ${year}`);
    this.logger.debug(`Repo(Record)->find()->$month: ${month}`);
    this.logger.debug(`Repo(Record)->find()->$day: ${day}`);
    return this.export(await this.get(year, month, day));
  }

  /**
   * @method import
   * @description convert domain to record layer
   * @param entity {Record} the domain layer
   * @returns {RecordModel}
   */
  import(entity: Record) {
    this.logger.debug(`Repo(Record)->import(): Enter`);
    this.logger.debug(
      `Repo(Record)->import()->$entity: ${JSON.stringify(entity)}`,
    );
    return Object.assign(new RecordModel(), entity);
  }

  /**
   * @method get
   * @description this is our data layer fetching from db
   * @param year {number} the year of the record
   * @param month {number} the month of the record
   * @param day {number} the day of the record
   * @returns {Promise<RecordModel>}
   */
  get(year: number, month: number, day: number) {
    this.logger.debug(`Repo(Record)->get(): Enter`);
    this.logger.debug(`Repo(Record)->get()->$year: ${year}`);
    this.logger.debug(`Repo(Record)->get()->$month: ${month}`);
    this.logger.debug(`Repo(Record)->get()->$day: ${day}`);
    return this.connection.manager.findOne(RecordModel, {
      where: {
        year: year,
        month: month,
        day: day,
      },
    });
  }

  /**
   * @method update
   * @param entity {Record} the mutation record
   * @return {Promise<void>}
   */
  async update(entity: Record) {
    this.logger.debug(`Repo(Record)->update(): Enter`);
    this.logger.debug(
      `Repo(Record)->update()->$entity: ${JSON.stringify(entity)}`,
    );

    const record = await this.get(entity.year, entity.month, entity.day);

    // if no record, bounce
    if (!record) throw new NotFoundException();

    // otherwise update the needed data
    this.connection.transaction(async (em: EntityManager) => {
      record.finishing = entity.finishing;
      await em.save(record);
      await entity.blocks.map(async (b: Block) => {
        await em.save(Object.assign(new BlockModel(), b, { record: record }));
      });
    });
  }
}
