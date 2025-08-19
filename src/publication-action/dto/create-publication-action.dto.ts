// src/publication-action/dto/create-publication-action.dto.ts
import { IsOptional, IsString, IsInt } from 'class-validator';
import { publication_action_enum } from '@prisma/client';

export class CreatePublicationActionDto {
  @IsOptional()
  action?: publication_action_enum;

  @IsOptional()
  @IsString()
  motif?: string;

  @IsInt()
  idpublication: number;

  @IsInt()
  idmembre: number;
}