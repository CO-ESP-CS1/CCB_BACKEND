import {
  IsString,
  IsEnum,
  IsOptional,
  IsInt,
  IsArray,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { statut_annonce_enum, priorite_annonce_enum } from '@prisma/client';

export class CreateAnnonceDto {
  @ApiPropertyOptional({ description: 'Titre de l\'annonce' })
  @IsOptional()
  @IsString()
  titreannonce?: string;

  @ApiPropertyOptional({ description: 'Description de l\'annonce' })
  @IsOptional()
  @IsString()
  descriptionannonce?: string;

  @ApiPropertyOptional({ description: 'URL de l\'image de l\'annonce' })
  @IsOptional()
  @IsString()
  imageurl?: string;

  @ApiPropertyOptional({ description: 'Date de publication de l\'annonce' })
  @IsOptional()
  @IsDateString()
  datepublication?: string;

  @ApiProperty({ description: 'Priorité de l\'annonce' })
  @IsEnum(priorite_annonce_enum)
  priorite: priorite_annonce_enum;

  @ApiProperty({ description: 'Statut de l\'annonce' })
  @IsEnum(statut_annonce_enum)
  statutannonce: statut_annonce_enum;

  // idmembre ne vient PAS du form-data, il vient du token → optionnel ici
  @ApiPropertyOptional({ description: 'ID du membre qui crée l\'annonce' })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  idmembre?: number;

  @ApiProperty({ description: 'ID du type d\'annonce' })
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  idtypeannonce: number;

  @ApiPropertyOptional({ description: 'Public cible de l\'annonce' })
  @IsOptional()
  @IsString()
  publique_cible?: string;

  @ApiPropertyOptional({ description: 'Liste des ID des assemblées' })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value.map(v => parseInt(v, 10));
    if (typeof value === 'string') return value.split(',').map(v => parseInt(v, 10));
    return [];
  })
  idassemblees?: number[];

  @ApiPropertyOptional({ description: 'Liste des ID des départements' })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value.map(v => parseInt(v, 10));
    if (typeof value === 'string') return value.split(',').map(v => parseInt(v, 10));
    return [];
  })
  iddepartements?: number[];
}
