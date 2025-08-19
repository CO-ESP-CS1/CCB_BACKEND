import { IsDateString, IsInt, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAnnonceAssembleeDto {
  @ApiProperty()
  @IsInt()
  idannonce: number;

  @ApiProperty()
  @IsInt()
  idassemblee: number;

}
