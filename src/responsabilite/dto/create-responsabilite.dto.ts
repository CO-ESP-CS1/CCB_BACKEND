// src/responsabilite/dto/create-responsabilite.dto.ts
import { IsOptional, IsString, IsInt } from 'class-validator';
import { statut_responsabilite_enum } from '@prisma/client';

export class CreateResponsabiliteDto {
  @IsOptional()
  @IsString()
  libelle?: string;

  @IsOptional()
  statutresponsabilite?: statut_responsabilite_enum;

  @IsInt()
  idtyperesponsabilite: number;
}