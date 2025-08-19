import { IsEnum, IsOptional } from 'class-validator';
import { statut_inscription_enum } from '@prisma/client';

export class UpdateInscriptionDto {
  @IsOptional()
  @IsEnum(statut_inscription_enum)
  statut?: statut_inscription_enum;
}