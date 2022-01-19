/**
 * @class
 * @name block
 * @description the block in the chain for record
 * @author Mark Leung <leungas@gmail.com>
 */
export class Block {
  /**
   * @constructor
   * @param block {number} the block number
   * @param gas {number} the gas usage
   * @param records {string[]} the transactions within the block
   */
  constructor(
    public block: number,
    public gas: number,
    public records: string[],
  ) {}
}
