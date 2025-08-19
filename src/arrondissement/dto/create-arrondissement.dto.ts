import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateArrondissementDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nomarrondissement?: string;

  @ApiProperty()
  @IsInt()
  idville: number;
}
