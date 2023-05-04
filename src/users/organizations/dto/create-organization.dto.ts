import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  name: string | null;

  @ApiProperty({ example: 'contact@yourorganization.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string | null;
}
