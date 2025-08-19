import { IsString, IsNotEmpty, IsOptional, IsEnum, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum TypePublicationEnum {
  STORY = 'STORY',
  POST = 'POST',
  VIDEO = 'VIDEO',
  SHORT = 'SHORT',
}

export class CreateVideoPublicationDto {
  @ApiProperty({
    description: 'Titre de la publication vidéo',
    example: 'Mon super vidéo',
  })
  @IsString()
  @IsNotEmpty()
  titre: string;

  @ApiPropertyOptional({
    description: 'Description de la publication',
    example: 'Description détaillée de la vidéo',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'URL du média vidéo',
    example: 'https://example.com/video.mp4',
  })
  @IsUrl()
  mediaurl: string;

  @ApiPropertyOptional({
    description: 'Date d\'expiration de la publication (optionnel)',
    example: '2025-12-31T23:59:59Z',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  expirationdate?: Date | null;

  @ApiProperty({
    description: 'Type de la publication',
    enum: TypePublicationEnum,
    default: TypePublicationEnum.VIDEO,
  })
  @IsEnum(TypePublicationEnum)
  typepublication: TypePublicationEnum = TypePublicationEnum.VIDEO;
}
