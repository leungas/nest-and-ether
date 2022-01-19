import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EthersModule } from 'nestjs-ethers';
import { EtherClient } from './clients/web3.client';
import { BlockModel } from './models/block.model';
import { RecordModel } from './models/record.model';
import { RecordRepository } from './repositories/record.repository';

/**
 * @class
 * @name InfrastructureModule
 * @description our wiring needed for NestJS on infrastructure functions
 * @author Mark Leung <leungas@gmail.com>
 */
@Module({
  imports: [
    EthersModule.forRoot(),
    TypeOrmModule.forFeature([RecordModel, BlockModel]),
  ],
  providers: [EtherClient, RecordRepository],
  exports: [EtherClient, RecordRepository],
})
export class InfrastructureModule {}
