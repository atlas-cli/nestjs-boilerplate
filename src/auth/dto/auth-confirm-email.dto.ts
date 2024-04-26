import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

/**
 * Data transfer object for confirming email
 * @class
 */
export class AuthConfirmEmailDto {
  /**
   * A hash string
   * @property
   */
  @ApiProperty()
  @IsNotEmpty()
  hash: string;
}
