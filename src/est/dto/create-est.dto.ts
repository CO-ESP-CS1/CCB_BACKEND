import { IsInt, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEstDto {
  @ApiProperty()
  @IsInt()
  idmembre: number;

  @ApiProperty()
  @IsInt()
  iddepartement: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  dateattribution?: string;
}
