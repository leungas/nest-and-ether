import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from '../../domain/services/app.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { EtherClient } from '../../infrastructure/clients/web3.client';
import { Connection } from 'typeorm';
import { RecordRepository } from '../../infrastructure/repositories/record.repository';
import { ConfigService } from '@nestjs/config';

describe('AppController', () => {
  let appController: AppController;
  //eslint-disable-next-line
  let connection;

  // this is our magic mock
  const mockTypeORMConnection = () => ({
    manager: {
      findOne: jest.fn(),
      find: jest.fn(),
      remove: jest.fn(),
      softRemove: jest.fn(),
      save: jest.fn(),
    },
    transaction: jest.fn(),
  });

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        RecordRepository,
        AppService,
        { provide: ConfigService, useValue: {} },
        { provide: Connection, useFactory: mockTypeORMConnection },
        {
          provide: WINSTON_MODULE_NEST_PROVIDER,
          useValue: {
            debug: (message: string) => {
              console.log(message);
            },
          },
        },
        {
          provide: EtherClient,
          useValue: {},
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    connection = await app.get<Connection>(Connection);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Our service is started!');
    });
  });
});
