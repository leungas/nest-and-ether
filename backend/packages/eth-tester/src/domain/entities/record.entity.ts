import { Block } from './block.entity';

/**
 * @class
 * @name Record
 * @description each day's record of data transaction
 * @author Mark Leung <leungas@gmail.com>
 */
export class Record {
  /**
   * @constructor
   * @param year {nunber} the year count
   * @param month {number} the month count
   * @param day {number} the day count
   * @param starting {number} the starting block of the day
   * @param closing {number} the closing block of the day
   * @param blocks {Block[]} the list of blocks in the day's record
   */
  constructor(
    public year: number,
    public month: number,
    public day: number,
    public starting: number,
    public finishing?: number,
    public blocks: Block[] = [],
  ) {}
}
