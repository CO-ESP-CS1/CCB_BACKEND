import { ApiProperty } from '@nestjs/swagger';
import { statut_inscription_enum } from '@prisma/client';

export class InscriptionResponseDto {
  @ApiProperty()
  idinscription: number;

  @ApiProperty({ enum: statut_inscription_enum, required: false })
  statut?: statut_inscription_enum;

  @ApiProperty()
  idmembre: number;

  @ApiProperty()
  createat: Date;

  @ApiProperty()
  updateat: Date;
}
