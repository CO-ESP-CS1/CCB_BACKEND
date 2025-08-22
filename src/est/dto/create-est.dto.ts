import { IsString, IsInt, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEstDto {
  @ApiProperty({ description: 'Code unique du membre' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'ID du département' })
  @IsInt()
  iddepartement: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  dateattribution?: string;
}
