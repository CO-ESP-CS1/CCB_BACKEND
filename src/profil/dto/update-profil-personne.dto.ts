import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProfilPersonneDto {
  @ApiProperty({
    description: 'Description du profil',
    example: 'Développeur fullstack passionné par NestJS',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Adresse physique de la personne',
    example: '123 Rue du Paradis, Paris',
    required: false
  })
  @IsOptional()
  @IsString()
  adresse?: string;
}