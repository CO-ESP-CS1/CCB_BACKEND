import { 
  IsOptional, 
  IsString, 
  IsEnum, 
  IsInt, 
  IsBoolean, 
  IsDateString 
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { statut_publication_enum, type_publication_enum } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePublicationDto {
  @ApiPropertyOptional({ description: 'Titre de la publication' })
  @IsOptional()
  @IsString()
  titre?: string;

  @ApiPropertyOptional({ description: 'Description de la publication' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ 
    description: 'Date d\'expiration au format ISO 8601', 
    type: String, 
    format: 'date-time' 
  })
  @IsOptional()
  @IsDateString()
  expirationdate?: string | null;

  @ApiProperty({
    description: 'Statut de la publication',
    enum: statut_publication_enum,
    example: statut_publication_enum.publie,
  })
  @IsEnum(statut_publication_enum)
  statutpublication: statut_publication_enum;

  @ApiProperty({
    description: 'Type de publication',
    enum: type_publication_enum,
    example: type_publication_enum.VIDEO,
  })
  @IsEnum(type_publication_enum)
  typepublication: type_publication_enum;

  @ApiProperty({
    description: 'Indique si la publication est temporaire',
    type: Boolean,
    example: false,
  })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  esttemporaire: boolean;

  @ApiProperty({
    description: 'Identifiant du membre qui crée la publication',
    type: Number,
    example: 123,
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  idmembre: number;
}
