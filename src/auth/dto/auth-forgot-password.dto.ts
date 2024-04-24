import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * @class AuthForgotPasswordDto
 *
 * This class is a Data Transfer Object (DTO) for the 'forgot password' feature of the Auth module.
 * It validates the 'email' property to ensure it is a valid email and transforms the 'email' property to a lower case string.
 */
export class AuthForgotPasswordDto {
  /**
   * @property email
   *
   * This property represents the email of the user who has forgotten their password.
   * It is transformed to lower case and is validated to ensure it is a valid email.
   */
  @ApiProperty()
  @Transform(({ value }) => value.toLowerCase().trim())
  @IsEmail()
  email: string;
}
