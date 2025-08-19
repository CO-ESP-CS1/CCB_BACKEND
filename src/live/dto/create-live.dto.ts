import { IsOptional, IsString, IsEnum, IsInt, IsDate } from 'class-validator';
import { statut_live_enum } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLiveDto1 {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  videourl?: string;

  @ApiProperty({ enum: statut_live_enum, required: false })
  @IsOptional()
  @IsEnum(statut_live_enum)
  statutlive?: statut_live_enum;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  titrelive?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  descriptionlive?: string;

  @ApiProperty({ required: false, type: String, format: 'time' })
  @IsOptional()
  heuredebut?: Date;

  @ApiProperty({ required: false, type: String, format: 'time' })
  @IsOptional()
  heurefin?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  idseance?: number;

  @ApiProperty()
  @IsInt()
  idmembre: number;
}
