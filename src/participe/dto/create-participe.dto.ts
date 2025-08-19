import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateParticipeDto {
  @ApiProperty()
  @IsInt()
  idmembre: number;

  @ApiProperty()
  @IsInt()
  idseance: number;
}
