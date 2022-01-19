import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WinstonLogger, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { EthersContract, JsonRpcProvider, Contract } from 'nestjs-ethers';
import { Usage } from '../../domain/entities/usage.entity';
import abi = require('./web3/web3.abi.json');

/**
 * @class
 * @name EtherClient
 * @description this client is our connect to the Ethers.js
 * @author Mark Leung <leungas@gmail.com>
 */
@Injectable()
export class EtherClient {
  private contract: Contract; // this is our ethers contract

  /**
   * @constructor
   * @param contract {EthersContract} this is our contract instance we need
   * @param config {ConfigService} the configuration we want to read from
   */
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: WinstonLogger,
    private readonly config: ConfigService,
  ) {}

  /**
   * @method export
   * @description conerting the usage data back to something meaningful
   * @param data {unknown} our data to covert
   * @returns {Usage}
   */
  export(data: unknown[]) {
    const fields = ['timestamp', 'blocks', 'gas'];
    const result = {};
    for (let i = 0; i < data.length; i++) {
      const value = parseInt(data[i].toString(), 10);
      Reflect.set(result, fields[i], i === 0 ? new Date(value) : value);
    }
    return Object.assign(new Usage(), result);
  }

  /**
   * @method getLatestBlock
   * @description get the latest block number from the chain
   * @returns {Promise<number>}
   */
  getLatestBlock() {
    this.logger.debug(`Client(Web3)->getLatestBlock(): Enter`);
    const connection = new JsonRpcProvider(this.config.get('ethers.host'));
    return connection.getBlockNumber();
  }

  /**
   * @method getBlocks
   * @param to {number} the end number of block to read
   * @param from {number} the starting block number
   * @returns {Promise<Block[]>}
   */
  getBlocks(to: number, from = 0) {
    this.logger.debug(`Client(Web3)->getBlocks(): Enter`);
    const blocks = Array.from({ length: to - from }, (_, i) => i + from);
    this.logger.debug(
      `Client(Web3)->getBlocks()->$blocks: ${JSON.stringify(blocks)}`,
    );
    const connection = new JsonRpcProvider(this.config.get('ethers.host'));
    return Promise.all(blocks.map((b: number) => connection.getBlock(b)));
  }

  /**
   * @method record
   * @description recording data onto the chain
   * @param timestamp {number} the time stamp data from secs
   * @param blocks {number} the total number of blocks
   * @param gas {number} the total number of gas
   * @return {Promise<Block>}
   */
  async record(timestamp: number, blocks: number, gas: number) {
    this.logger.debug(`Client(Web3)->record(): Enter`);
    const connection = new JsonRpcProvider(this.config.get('ethers.host'));
    this.contract = new EthersContract(connection).create(
      this.config.get('ethers.contract'),
      abi,
    );
    this.logger.debug(
      `Client(Web3): Using wallet address from config ${this.config.get(
        'ethers.wallet',
      )}`,
    );
    const wallet = connection.getSigner(this.config.get('ethers.wallet'));
    this.logger.debug(
      `Client(Web3)->record(): Wallet has address: ${await wallet.getAddress()}`,
    );
    this.contract = this.contract.connect(wallet);
    return this.contract['record'](timestamp, blocks, gas);
  }

  /**
   * @method getAll
   * @description calling the getAll function on the Solidity contract
   * @returns {Record<string, any>[]}
   */
  async getAll() {
    this.logger.debug(`Client(Web3)->getAll(): Enter`);
    const connection = new JsonRpcProvider(this.config.get('ethers.host'));
    this.contract = new EthersContract(connection).create(
      this.config.get('ethers.contract'),
      abi,
    );
    this.logger.debug(
      `Client(Web3): Using wallet address from config ${this.config.get(
        'ethers.wallet',
      )}`,
    );
    const wallet = connection.getSigner(this.config.get('ethers.wallet'));
    this.logger.debug(
      `Client(Web3)->record(): Wallet has address: ${await wallet.getAddress()}`,
    );
    this.contract = this.contract.connect(wallet);
    return (await this.contract['getAll']()).map((i) => this.export(i));
  }
}
