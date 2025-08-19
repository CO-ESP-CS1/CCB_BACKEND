// src/publication/dto/create-publication.dto.ts
import { IsOptional, IsString, IsInt, IsDateString } from 'class-validator';
import { statut_publication_enum } from '@prisma/client'; // Assure-toi que l’enum est exporté par Prisma
import { Type } from 'class-transformer';

export class CreatePublicationDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  mediaurl?: string;

  @IsOptional()
@IsDateString()
expirationdate?: string;


  @IsOptional()
  statutpublication?: statut_publication_enum;

  @IsInt()
  idmembre: number;

  @IsInt()
  idtypepublication: number;
}