import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProfilPersonneDto {
  @ApiProperty({
    description: 'ID de la personne associée au profil',
    example: 1,
    required: true
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  idpersonne: number;

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