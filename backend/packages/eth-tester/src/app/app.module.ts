import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { DomainModule } from '../domain/domain.module';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from 'src/infrastructure/config/configuration';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { Web3Controller } from './controllers/web3.controller';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    DomainModule,
    InfrastructureModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => {
        return {
          ...config.get('datasource'),
          autoLoadEntities: true,
        };
      },
      inject: [ConfigService],
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          level: 'debug',
          format: winston.format.combine(
            winston.format.align(),
            winston.format.colorize(),
            winston.format.json(),
            winston.format.simple(),
            winston.format.splat(),
            winston.format.timestamp(),
            winston.format.uncolorize(),
          ),
        }),
      ],
    }),
  ],
  controllers: [AppController, Web3Controller],
  providers: [],
})
export class AppModule {}
