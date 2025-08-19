import { 
  IsOptional, 
  IsString, 
  IsEnum, 
  IsInt, 
  IsBoolean,
  IsMimeType
} from 'class-validator';
import { Transform } from 'class-transformer';
import { statut_publication_enum } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAudioPublicationDto {
  @ApiPropertyOptional({
    description: 'Titre de la publication audio',
  })
  @IsString()
  @IsOptional()
  titre?: string;

  @ApiPropertyOptional({
    description: 'Description de la publication audio',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Fichier audio à uploader',
    type: 'string', 
    format: 'binary',
  })
  @IsOptional()

  mediaurl?: Express.Multer.File;

  @ApiProperty({
    description: 'Identifiant du membre qui crée la publication',
    type: Number,
    example: 123,
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  idmembre: number;

  @ApiPropertyOptional({
    description: 'Statut de la publication, par défaut "en_attente"',
    enum: Object.values(statut_publication_enum),
    default: statut_publication_enum.en_attente,
  })
  @IsEnum(statut_publication_enum)
  @IsOptional()
  statutpublication?: statut_publication_enum = statut_publication_enum.en_attente;

  @ApiPropertyOptional({
    description: 'Publication temporaire, par défaut false',
    type: Boolean,
    default: false,
  })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @IsOptional()
  esttemporaire?: boolean = false;
}