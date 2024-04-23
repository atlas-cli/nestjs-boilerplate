import { IsEmail, IsNotEmpty, MinLength, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotExist } from './../../common/utils/validators/is-not-exists.validator';

/**
 * Data Transfer Object (DTO) class for authentication register/login
 */
export class AuthRegisterLoginDto {
  /** User email with example 'test1@example.com' */
  @ApiProperty({ example: 'test1@example.com' })
  @Transform(({ value }) => value.toLowerCase().trim())
  @Validate(IsNotExist, ['User'], {
    message: 'emailAlreadyExists',
  })
  @IsEmail()
  email: string;

  /** User password with minimum length of 6 */
  @ApiProperty()
  @MinLength(6)
  password: string;

  /** User first name with example 'John' */
  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  firstName: string;

  /** User last name with example 'Doe' */
  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  lastName: string;
}