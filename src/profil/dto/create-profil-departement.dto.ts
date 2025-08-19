import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateProfilDepartementDto {
  @ApiProperty({ description: 'ID du département' })
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  iddepartement: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}