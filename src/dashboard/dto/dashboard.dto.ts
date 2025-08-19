// dto/dashboard.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Membres et badges
 */
export class BadgeDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nom?: string;
}

export class MembreDto {
  @ApiProperty()
  @IsNumber()
  idmembre: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  role?: string | null;

  @ApiPropertyOptional({ description: 'Objet personne associé au membre' })
  @IsOptional()
  personne?: any;

  @ApiPropertyOptional({ type: [BadgeDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BadgeDto)
  badges?: BadgeDto[];
}

/**
 * DTO pour Live en cours
 */
export class LiveOngoingDto {
  @ApiProperty()
  @IsNumber()
  idlive: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  titrelive?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descriptionlive?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  videourl?: string | null;

  @ApiPropertyOptional({ description: 'Heure de début au format HH:MM:SS' })
  @IsOptional()
  @IsString()
  heuredebut?: string | null;

  @ApiPropertyOptional({ description: 'Heure de fin au format HH:MM:SS' })
  @IsOptional()
  @IsString()
  heurefin?: string | null;

  @ApiProperty()
  @IsNumber()
  idmembre: number;

  @ApiProperty({ type: MembreDto })
  @ValidateNested()
  @Type(() => MembreDto)
  membre: MembreDto;
}

/**
 * DTO pour Annonces non lues
 */
/**
 * DTO pour Annonces non lues
 */
export class AnnouncementDto {
  @ApiProperty()
  @IsNumber()
  idannonce: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  titreannonce?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descriptionannonce?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  datepublication?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  priorite?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  statutannonce?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  publique_cible?: string | null;  // <-- ajout ici

  @ApiPropertyOptional({ type: MembreDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => MembreDto)
  membre?: MembreDto;
}


/**
 * DTO pour Stories
 */
export class StoryDto {
  @ApiProperty()
  @IsNumber()
  idpublication: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  titre?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mediaurl?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  expirationdate?: string | null;

  @ApiProperty()
  @IsNumber()
  idmembre: number;

  @ApiProperty({ type: MembreDto })
  @ValidateNested()
  @Type(() => MembreDto)
  membre: MembreDto;
}

/**
 * DTO pour Publications
 */
export class PublicationDto {
  @ApiProperty()
  @IsNumber()
  idpublication: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  titre?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mediaurl?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mediaurl2?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mediaurl3?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  typepublication?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  esttemporaire?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  createat?: string;

  @ApiProperty()
  @IsNumber()
  idmembre: number;

  @ApiProperty({ type: MembreDto })
  @ValidateNested()
  @Type(() => MembreDto)
  membre: MembreDto;
}

/**
 * DTO principal du Dashboard
 */
export class DashboardDto {
  @ApiProperty({ type: [LiveOngoingDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LiveOngoingDto)
  livesEnCours: LiveOngoingDto[];

  @ApiProperty({ type: [AnnouncementDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnnouncementDto)
  annoncesNonLues: AnnouncementDto[];

  @ApiProperty({ type: [StoryDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StoryDto)
  stories: StoryDto[];

  @ApiProperty({ type: [PublicationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PublicationDto)
  publications: PublicationDto[];
}
