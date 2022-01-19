import { Inject, Injectable } from '@nestjs/common';
import { WinstonLogger, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { EtherClient } from 'src/infrastructure/clients/web3.client';
import { RecordRepository } from 'src/infrastructure/repositories/record.repository';
import { Block } from '../entities/block.entity';
import { Record as Rec } from '../entities/record.entity';

@Injectable()
export class AppService {
  /**
   * @constructor
   * @param logger {WinstonLogger} the console logger
   * @param client {EtherClient} connection to Web3
   */
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: WinstonLogger,
    private readonly client: EtherClient,
    private readonly records: RecordRepository,
  ) {}

  /**
   * @method health
   * @description the healthcheck signal
   * @returns {string}
   */
  health(): string {
    return 'Our service is started!';
  }

  /**
   * @method convert
   * @description the conversion from ETH block data to real stuff
   * @param gasBill {Record<string, any>
   * @return {Block}
   */
  convert(gasBill: Record<string, any>) {
    this.logger.debug(`Service(App)->convert(): Enter`);
    this.logger.debug(
      `Service(App)->convert()->$gasBill: ${JSON.stringify(gasBill)}`,
    );
    const gas = parseInt(Reflect.get(gasBill, 'gasUsed'), 16);
    const result = new Block(
      Reflect.get(gasBill, 'number'),
      gas,
      Reflect.get(gasBill, 'transactions'),
    );
    this.logger.debug(
      `Service(App)->convert()->$result: ${JSON.stringify(result)}`,
    );
    return result;
  }

  /**
   * @method prepare
   * @description preparing the latest day record
   * @return {Promise<void>}
   */
  async prepare() {
    this.logger.debug(`Service(App)->prepare(): Enter`);
    const current = new Date();
    const entity = new Rec(
      current.getFullYear(),
      current.getMonth(),
      current.getDate(),
      await this.client.getLatestBlock(),
    );
    await this.records.create(entity);
  }

  /**
   * @method finish
   * @description to coplete the day-end recording
   * @param year {number} the year to record
   * @param month {number} the month to record
   * @param day {number} the day to record
   * @return {Promise<void>}
   */
  async finish(year: number, month: number, day: number) {
    this.logger.debug(`Service(App)->finish(): Enter`);
    this.logger.debug(`Service(App)->finish()->$year: ${year}`);
    this.logger.debug(`Service(App)->finish()->$month: ${month}`);
    this.logger.debug(`Service(App)->finish()->$day: ${day}`);
    const record = await this.records.find(year, month, day);
    record.finishing = await this.client.getLatestBlock();

    // if we have blocks, write to db
    if (record.finishing && record.finishing - record.starting > 0) {
      const dataset = await this.client.getBlocks(
        record.finishing,
        record.starting,
      );
      record.blocks = dataset.map((b) => this.convert(b));
    }

    // now do the finalising
    this.logger.debug(
      `Service(App)->finish()->$record: ${JSON.stringify(record)}`,
    );
    await this.records.update(record);

    // now let's write to Web3
    let totalGas = 0;
    record.blocks.forEach((b) => {
      totalGas += b.gas;
    });
    await this.client.record(
      new Date().getTime(),
      record.blocks.length,
      totalGas,
    );
  }

  /**
   *
   * @returns
   */
  async list() {
    this.logger.debug(`Service(App)->list(): Enter`);
    return this.client.getAll();
  }

  // get(time?: Date) {
  //   this.logger.debug(`Service(App)->get(): Enter`);
  //   this.logger.debug(`Service(App)->get()->$time: ${JSON.stringify(time)}`);
  //   return this.client.getAll();
  // }

  // getLatestBlock() {
  //   return this.client.getLatestBlock();
  // }

  // inspect() {
  //   this.logger.debug(`Service(App)->inspect(): Enter`);
  //   this.logger.debug(`Service(App)->inspect(): `);
  //   return this.client.getBlocks(7);
  // }

  // record(usage: Usage) {
  //   this.logger.debug(`Service(App)->record()->$usage: ${JSON.stringify(usage)}`);
  //   this.logger.debug(`Service(App)->record()->$usage.timestamp: ${JSON.stringify(usage.timestamp.getTime())}`);
  //   return this.client.record(usage.timestamp.getTime(), usage.blocks, usage.gas);
  // }
}
