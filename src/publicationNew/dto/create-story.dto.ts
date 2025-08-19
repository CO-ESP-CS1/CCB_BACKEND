import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStoryDto {
  @ApiProperty({ description: 'Description de la story', example: 'Voici une super story' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ description: 'Identifiant du membre (optionnel)', example: 123 })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? parseInt(value, 10) : value))
  @IsInt()
  idmembre?: number;
}
