import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePaysDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nompays?: string;
}
