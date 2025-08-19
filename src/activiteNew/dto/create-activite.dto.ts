import {
  IsOptional,
  IsString,
  IsBoolean,
  IsDateString,
  IsInt,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateActiviteDto {
  @ApiPropertyOptional({
    description: 'Libellé de l\'activité (par exemple, "Atelier Yoga")',
    example: 'Atelier Yoga',
  })
  @IsOptional()
  @IsString()
  libelleactivite?: string;

  @ApiPropertyOptional({
    description: 'Description détaillée de l\'activité (par exemple, "Une séance de yoga pour débutants")',
    example: 'Une séance de yoga pour débutants',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value ? value.trim() : undefined)  // Enlever les espaces superflus, si nécessaire
  descriptionactivite?: string;

  @ApiPropertyOptional({
    description: 'Date de début de l\'activité au format ISO (ex. "2025-09-01")',
    example: '2025-09-01',
  })
  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => (typeof value === 'string' ? value : value?.toISOString()))
  datedebut?: string;

  @ApiPropertyOptional({
    description: 'Date de fin de l\'activité au format ISO (ex. "2025-09-30")',
    example: '2025-09-30',
  })
  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => (typeof value === 'string' ? value : value?.toISOString()))
  datefin?: string;

  @ApiProperty({
    description: 'Statut de l\'activité (ex. "en cours", "terminée")',
    example: 'en cours',
    default: 'en cours',
  })
  @IsString()
  statutactivite: string = 'en cours';

  @ApiProperty({
    description: 'ID du type d\'activité (ex. 1 pour Yoga)',
    example: 1,
  })
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))  // Conversion de la chaîne en entier
  idtypeactivites: number;

  @ApiProperty({
    description: 'Indique si l\'inscription est nécessaire pour cette activité',
    example: false,
    default: false,
  })
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)  // Transformation pour s\'assurer que c\'est bien un boolean
  necessiteInscription: boolean = false;

  @ApiPropertyOptional({
    description: 'Public cible de l\'activité (ex. "Adultes", "Enfants")',
    example: 'Adultes',
  })
  @IsOptional()
  @IsString()
  publicCible?: string;

  // Ajouter ces champs pour l'image
  @ApiPropertyOptional({
    description: 'URL de l\'image (ex. "https://image.cloudinary.com/...")',
    example: 'https://image.cloudinary.com/...',
  })
  @IsOptional()
  @IsString()
  imageurl?: string;

  @ApiPropertyOptional({
    description: 'Public ID de l\'image dans Cloudinary (ex. "publications/ktwkzdrafghg7karla5a")',
    example: 'publications/ktwkzdrafghg7karla5a',
  })
  @IsOptional()
  @IsString()
  public_id?: string;
}
