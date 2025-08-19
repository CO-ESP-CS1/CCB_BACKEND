import { IsEnum, IsInt } from 'class-validator';
import { statut_inscription_enum } from '@prisma/client';

export class CreateInscriptionDto {
  @IsInt()
  idmembre: number;

  @IsInt()
  idactivite: number;

  @IsEnum(statut_inscription_enum)
  statut: statut_inscription_enum;
}