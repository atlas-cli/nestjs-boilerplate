import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';

export class Role {
  @ApiProperty({ example: 1 })
  id: number;

  @Allow()
  @ApiProperty({ example: 'Admin' })
  name?: string;
}
