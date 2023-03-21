import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';

export class Status {
  @ApiProperty({ example: 1 })
  id: number;

  @Allow()
  @ApiProperty({ example: 'Active' })
  name?: string;
}
