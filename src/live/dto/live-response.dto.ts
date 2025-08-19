import { ApiProperty } from '@nestjs/swagger';
import { statut_live_enum } from '@prisma/client';

export class LiveResponseDto {
  @ApiProperty()
  idlive: number;

  @ApiProperty({ required: false })
  videourl?: string;

  @ApiProperty({ enum: statut_live_enum, required: false })
  statutlive?: statut_live_enum;

  @ApiProperty({ required: false })
  titrelive?: string;

  @ApiProperty({ required: false })
  descriptionlive?: string;

  @ApiProperty({ required: false, type: String, format: 'time' })
  heuredebut?: Date;

  @ApiProperty({ required: false, type: String, format: 'time' })
  heurefin?: Date;

  @ApiProperty({ required: false })
  idseance?: number;

  @ApiProperty()
  idmembre: number;

  @ApiProperty()
  createat: Date;

  @ApiProperty()
  updateat: Date;
}
