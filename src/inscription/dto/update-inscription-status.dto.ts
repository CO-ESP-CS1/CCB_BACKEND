import { IsEnum } from 'class-validator';
import { statut_inscription_enum } from '@prisma/client';

export class UpdateInscriptionStatusDto {
  @IsEnum(statut_inscription_enum)
  statut: statut_inscription_enum;
}