import { IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMembreBadgeDto {
  @ApiProperty()
  @IsInt()
  idmembre: number;

  @ApiProperty()
  @IsInt()
  idbadge: number;

  @ApiProperty({ required: false })
  @IsOptional()
  dateattribution?: Date;
}
