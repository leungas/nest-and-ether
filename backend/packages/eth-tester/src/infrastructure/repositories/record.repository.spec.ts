import { Test, TestingModule } from '@nestjs/testing';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Record } from '../../domain/entities/record.entity';
import {
  Connection,
  FindConditions,
  FindManyOptions,
  FindOneOptions,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { RecordModel } from '../models/record.model';
import { RecordRepository } from './record.repository';
import { Block } from '../../domain/entities/block.entity';

describe('SubscriptionRepository', () => {
  let target: RecordRepository;
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

  const mockedManager = {
    save: jest.fn().mockImplementation(async (entity: RecordModel) => {
      entity.id = uuid();
      return entity;
    }),
    remove: jest.fn().mockImplementation(async () => {
      return Promise.resolve();
    }),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        RecordRepository,
        { provide: Connection, useFactory: mockTypeORMConnection },
        {
          provide: WINSTON_MODULE_NEST_PROVIDER,
          useValue: {
            debug: (message: string) => {
              console.log(message);
            },
          },
        },
      ],
    }).compile();

    target = await app.get<RecordRepository>(RecordRepository);
    connection = await app.get<Connection>(Connection);
  });

  it('test create instance', () => {
    expect(target).toBeDefined();
  });

  it('test create', async () => {
    connection.transaction.mockImplementation((cb) => {
      cb(mockedManager);
    });
    jest
      .spyOn(connection.manager, 'save')
      .mockImplementation((entity: RecordModel) => {
        entity.id = uuid();
        return Promise.resolve(entity);
      });

    const entity: Record = {
      year: 2022,
      month: 0,
      day: 19,
      starting: 0,
      blocks: [],
    };
    const result = await target.create(entity);
    expect(result).toBeUndefined();
  });

  it('test find', async () => {
    connection.transaction.mockImplementation((cb) => {
      cb(mockedManager);
    });
    jest
      .spyOn(connection.manager, 'findOne')
      .mockImplementation((_, query: FindOneOptions<RecordModel>) => {
        const year = Reflect.get(
          query.where as FindConditions<RecordModel>,
          'year',
        );
        const month = Reflect.get(
          query.where as FindConditions<RecordModel>,
          'month',
        );
        const day = Reflect.get(
          query.where as FindConditions<RecordModel>,
          'day',
        );
        console.log(`${year}/${month}/${day}`)
        if (year === 2022 && month === 0 && day === 19) {
          const result = new RecordModel();
          result.id = 1;
          result.year = 2022;
          result.month = 0;
          result.day = 19;
          result.starting = 1;
          result.finishing = null;
          result.blocks = [];
          return Promise.resolve(result);
        } else return Promise.resolve(null);
      });

    const result = await target.find(2022, 0, 19);
    expect(result).toBeDefined();
  });

  it('test find with bad id', async () => {
    connection.transaction.mockImplementation((cb) => {
      cb(mockedManager);
    });
    jest
      .spyOn(connection.manager, 'findOne')
      .mockImplementation((_, query: FindOneOptions<RecordModel>) => {
        const year = Reflect.get(
          query.where as FindConditions<RecordModel>,
          'year',
        );
        const month = Reflect.get(
          query.where as FindConditions<RecordModel>,
          'month',
        );
        const day = Reflect.get(
          query.where as FindConditions<RecordModel>,
          'day',
        );
        console.log(`${year}/${month}/${day}`)
        if (year === 2022 && month === 0 && day === 19) {
          const result = new RecordModel();
          result.id = 1;
          result.year = 2022;
          result.month = 0;
          result.day = 19;
          result.starting = 1;
          result.finishing = null;
          result.blocks = [];
          return Promise.resolve(result);
        } else return Promise.resolve(null);
      });
    const result = await target.find(2022, 0, 18);
    expect(result).toBe(null);
  });

  it('test update without matching record', async () => {
    connection.transaction.mockImplementation((cb) => {
      cb(mockedManager);
    });
    jest
      .spyOn(connection.manager, 'findOne')
      .mockImplementation((_, query: FindOneOptions<RecordModel>) => {
        const year = Reflect.get(
          query.where as FindConditions<RecordModel>,
          'year',
        );
        const month = Reflect.get(
          query.where as FindConditions<RecordModel>,
          'month',
        );
        const day = Reflect.get(
          query.where as FindConditions<RecordModel>,
          'day',
        );
        console.log(`${year}/${month}/${day}`)
        if (year === 2022 && month === 0 && day === 19) {
          const result = new RecordModel();
          result.id = 1;
          result.year = 2022;
          result.month = 0;
          result.day = 19;
          result.starting = 1;
          result.finishing = null;
          result.blocks = [];
          return Promise.resolve(result);
        } else return Promise.resolve(null);
      });

    const entity: Record = {
      year: 2022,
      month: 0,
      day: 18,
      starting: 0,
      blocks: [],
    };

    // const result = await target.find(2022, 0, 18);
    expect(target.update(entity)).rejects.toThrowError()
  });

  it('test update', async () => {
    connection.transaction.mockImplementation((cb) => {
      cb(mockedManager);
    });
    jest
      .spyOn(connection.manager, 'findOne')
      .mockImplementation((_, query: FindOneOptions<RecordModel>) => {
        const year = Reflect.get(
          query.where as FindConditions<RecordModel>,
          'year',
        );
        const month = Reflect.get(
          query.where as FindConditions<RecordModel>,
          'month',
        );
        const day = Reflect.get(
          query.where as FindConditions<RecordModel>,
          'day',
        );
        console.log(`${year}/${month}/${day}`)
        if (year === 2022 && month === 0 && day === 19) {
          const result = new RecordModel();
          result.id = 1;
          result.year = 2022;
          result.month = 0;
          result.day = 19;
          result.starting = 1;
          result.finishing = null;
          result.blocks = [];
          return Promise.resolve(result);
        } else return Promise.resolve(null);
      });

    const entity: Record = {
      year: 2022,
      month: 0,
      day: 19,
      starting: 0,
      blocks: [
        new Block(1, 56718, ['some transaction'])
      ],
    };

    const result = await target.update(entity);
    expect(result).toBeUndefined();
  });

});
