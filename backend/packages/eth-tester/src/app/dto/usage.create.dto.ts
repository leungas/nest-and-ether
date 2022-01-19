import { OmitType } from '@nestjs/swagger';
import { Usage } from 'src/domain/entities/usage.entity';

/**
 * @class
 * @name UsageCreateDataObject
 * @description the request object we use to connect the controller layer from HTTP layer
 * @author Mark Leung <leungas@gmail.com>
 */
export class UsageCreateDataObject extends OmitType(Usage, [
  'timestamp',
] as const) {}
