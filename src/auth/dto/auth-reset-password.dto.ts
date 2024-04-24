import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

/**
 * This class represents the Data Transfer Object for the AuthResetPassword operation.
 * It provides validation rules for the password and hash fields, which are both required,
 * and are exposed in the API documentation through the ApiProperty decorator.
 */
export class AuthResetPasswordDto {
  /**
   * The new password to be set.
   * It must be provided, as indicated by the IsNotEmpty decorator.
   */
  @ApiProperty()
  @IsNotEmpty()
  password: string;

  /**
   * The hash associated with the password reset request.
   * It must be provided, as indicated by the IsNotEmpty decorator.
   */
  @ApiProperty()
  @IsNotEmpty()
  hash: string;
}
