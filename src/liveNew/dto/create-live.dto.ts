// src/live/dto/create-live.dto.ts
import { IsNotEmpty, IsOptional, IsString, IsDateString, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLiveDto {
  @ApiProperty({
    description: 'Titre du live',
    example: 'Présentation du produit X',
  })
  @IsString()
  @IsNotEmpty()
  titrelive: string;

  @ApiProperty({
    description: 'Description du live',
    example: 'Description détaillée du live sur le produit X',
  })
  @IsString()
  @IsNotEmpty()
  descriptionlive: string;

  @ApiProperty({
    description: "URL de la vidéo du live (fournie par l'utilisateur)",
    example: 'https://exemple.com/videos/live123.mp4',
  })
  @IsString()
  @IsNotEmpty()
  videourl: string;

  @ApiProperty({
    description: 'Heure de début du live au format ISO 8601',
    example: '2025-08-09T10:00:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  heuredebut: string;

  @ApiProperty({
    description: 'Heure de fin du live au format ISO 8601',
    example: '2025-08-09T11:00:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  heurefin: string;

  @ApiPropertyOptional({
    description: "ID optionnel de la séance associée au live",
    example: 42,
  })
  @IsInt()
  @IsOptional()
  idseance?: number;
}
