import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { WinstonLogger, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppService } from './app.service';

@Injectable()
export class SchedulerService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: WinstonLogger,
    private readonly service: AppService,
  ) {}

  /**
   * @method initialize
   * @description doing the day start setup
   * @returns {Promise<void>}
   */
  @Cron('0 0 0 * * *')
  async initialize() {
    this.logger.debug('Service(Schedule)->initialie(): Enter');
    await this.service.prepare();
  }

  /**
   * @method initialize
   * @description doing the day start setup
   * @returns {Promise<void>}
   */
  @Cron('59 59 23 * *')
  async finalize() {
    this.logger.debug('Service(Schedule)->finalize(): Enter');
    const current = new Date();
    await this.service.finish(
      current.getFullYear(),
      current.getMonth(),
      current.getDate(),
    );
  }
}
