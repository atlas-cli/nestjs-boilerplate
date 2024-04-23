import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Validate } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsExist } from './../../common/utils/validators/is-exists.validator';

/**
 * Data Transfer Object for Email Login in authentication service.
 * 
 * It consists of email and password.
 * 
 * The email is validated in two ways:
 * 1. It is converted to lowercase and trimmed to avoid inconsistencies.
 * 2. It is validated for existence in the database by using the custom 'IsExist' validator.
 * 
 * The password is validated for non-emptiness.
 */
export class AuthEmailLoginDto {

  /**
   * The user's email address. 
   * It is validated for existence in the database.
   */
  @ApiProperty({ example: 'test1@example.com' })
  @Transform(({ value }) => value.toLowerCase().trim())
  @Validate(IsExist, ['User'], {
    message: 'emailNotExists',
  })
  email: string;

  /**
   * The user's password. 
   * It is validated for non-emptiness.
   */
  @ApiProperty()
  @IsNotEmpty()
  password: string;
}