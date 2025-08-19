import { IsOptional, IsString, IsUrl, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateShortDto {
  @ApiPropertyOptional({ description: 'Titre du short' })
  @IsOptional()
  @IsString()
  titre?: string;

  @ApiPropertyOptional({ description: 'Description du short' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'URL du média vidéo', format: 'url', example: 'https://exemple.com/video.mp4' })
  @IsString()
  @IsUrl()
  mediaurl: string;

  @ApiProperty({ description: 'Identifiant du membre qui crée le short', example: 123 })
  @IsInt()
  idmembre: number; // obligatoire
}
