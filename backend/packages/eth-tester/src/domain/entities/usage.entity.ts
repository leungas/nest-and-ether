import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber, Min } from 'class-validator';

/**
 * @class
 * @name Usage
 * @description This is the usage reocrd we want to use to record on block
 * @author Mark Leung
 */
export class Usage {
  /**
   * @property
   * @name timestamp
   * @type {Date}
   * @description the time when the usage is created
   */
  @ApiProperty({
    name: 'timestamp',
    type: 'date',
    description: 'The time when the usage record is for',
    example: new Date().toISOString(),
    readOnly: true,
  })
  timestamp: Date = new Date();

  /**
   * @property
   * @name blocks
   * @type {number}
   * @description this is number of blocks at the time of record
   */
  @ApiProperty({
    name: 'blocks',
    type: 'number',
    description: 'The number of blocks at the time of generating this usage',
    example: 1000,
    required: true,
  })
  @IsNumber()
  @IsDefined()
  @Min(0)
  start: number;

  /**
   * @property
   * @name gas
   * @type {number}
   * @description this is wallet gas count
   */
  @ApiProperty({
    name: 'gas',
    type: 'number',
    description: 'The gas on wallet at the time of generating this usage',
    example: 1000,
    required: true,
  })
  @IsNumber()
  @IsDefined()
  @Min(0)
  gas: number;
}
