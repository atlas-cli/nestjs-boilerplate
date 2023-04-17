import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  name: string | null;
}
