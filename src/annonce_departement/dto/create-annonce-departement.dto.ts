import { IsDateString, IsInt, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAnnonceDepartementDto {
  @ApiProperty()
  @IsInt()
  idannonce: number;

  @ApiProperty()
  @IsInt()
  iddepartement: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dateciblage?: string;
}
