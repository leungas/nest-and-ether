import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WinstonLogger, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppService } from 'src/domain/services/app.service';

/**
 * @class
 * @name Web3Controller
 * @description the Web3 related functions
 * @author Mark Leung <leungas@gmail.com>
 */
@Controller('web3')
@ApiTags('Web3')
export class Web3Controller {
  /**
   * @constructor
   * @param logger {WinstonLogger} the console looger
   * @param service {AppSerivce} the service for running app
   */
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: WinstonLogger,
    private readonly service: AppService,
  ) {}

  /**
   * @method setup
   * @description generate the ETH record
   * @returns {Promise<void>}
   */
  @Post('records')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Simulate setup the of the record at day start',
    description: 'Setting the day start record',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Successfully executex',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Record already exists, so cannot prepare another one',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Problem with the service, check logs for details',
  })
  setup() {
    this.logger.debug(`Controller(Web3)->setup(): Enter`);
    return this.service.prepare();
  }

  /**
   * @method list
   * @description the listing of all records on ETH chain
   * @returns {Promise<Usage[]>}
   */
  @Get('records')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listing out all our chain records',
    description: 'Getting all our records on chain with blocks and gas',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful execution',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Problem with service, check logs for details',
  })
  list() {
    this.logger.debug(`Controller(Web3)->list(): Enter`);
    return this.service.list();
  }

  /**
   * @method complete
   * @description to simulate day-end record
   * @param year {number} the year to record
   * @param month {number} the month to record
   * @param day {number} the day to record
   * @returns
   */
  @Put('records/:year/:month/:day')
  @ApiOperation({
    summary: 'Listing out all our chain records',
    description: 'Getting all our records on chain with blocks and gas',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Successful execution',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The specified date record is not available',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Problem with service, check logs for details',
  })
  complete(
    @Param('year') year: number,
    @Param('month') month: number,
    @Param('day') day: number,
  ) {
    this.logger.debug(`Controller(Web3)->complete(): Enter`);
    this.logger.debug(`Controller(Web3)->complete()->$year: ${year}`);
    this.logger.debug(`Controller(Web3)->complete()->$month: ${month}`);
    this.logger.debug(`Controller(Web3)->complete()->$day: ${day}`);
    return this.service.finish(year, month, day);
  }
}
