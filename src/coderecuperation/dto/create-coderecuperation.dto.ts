import { IsString, IsOptional, IsBoolean, IsDateString, IsEnum, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { statut_code_recuperation } from '@prisma/client';

export class CreateCodeRecuperationDto {
  @ApiProperty({ description: 'Numéro de téléphone', required: false })
  @IsOptional()
  @IsString()
  telephone?: string;

  @ApiProperty({ description: 'Code OTP', required: false })
  @IsOptional()
  @IsString()
  codeotp?: string;

  @ApiProperty({ description: 'Identifiant du device', required: false })
  @IsOptional()
  @IsString()
  deviceid?: string;

  @ApiProperty({ description: 'Code de récupération', required: false })
  @IsOptional()
  @IsString()
  coderecup?: string;

  @ApiProperty({ description: 'Date de début de validité (ISO 8601)', required: false })
  @IsOptional()
  @IsDateString()
  datedebutvalidite?: string;

  @ApiProperty({ description: 'Date d’expiration (ISO 8601)', required: false })
  @IsOptional()
  @IsDateString()
  expirele?: string;

  @ApiProperty({ description: 'Indique si le code est utilisé', required: false })
  @IsOptional()
  @IsBoolean()
  estutilise?: boolean;

  @ApiProperty({ description: 'Statut du code', enum: statut_code_recuperation, required: false })
  @IsOptional()
  @IsEnum(statut_code_recuperation)
  statut?: statut_code_recuperation;

  @ApiProperty({ description: 'ID de connexion', example: 123 })
  @IsInt()
  connexionid: number;
}
