import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';

/**
 * Data Transfer Object (DTO) for updating authentication information.
 * Contains optional fields for first name, last name, password and old password.
 * @class
 */
export class AuthUpdateDto {
  /** 
   * Optional first name field.
   * @example 'John'
   * @property {string} firstName
   */
  @ApiProperty({ example: 'John' })
  @IsOptional()
  @IsNotEmpty({ message: 'mustBeNotEmpty' })
  firstName?: string;

  /** 
   * Optional last name field.
   * @example 'Doe'
   * @property {string} lastName
   */
  @ApiProperty({ example: 'Doe' })
  @IsOptional()
  @IsNotEmpty({ message: 'mustBeNotEmpty' })
  lastName?: string;

  /** 
   * Optional password field. 
   * Must be at least 6 characters long.
   * @property {string} password
   */
  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @MinLength(6)
  password?: string;

  /** 
   * Optional field for the old password.
   * @property {string} oldPassword
   */
  @ApiProperty()
  @IsOptional()
  @IsNotEmpty({ message: 'mustBeNotEmpty' })
  oldPassword: string;
}