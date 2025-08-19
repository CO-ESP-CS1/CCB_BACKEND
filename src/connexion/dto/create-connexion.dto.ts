import { IsString, IsOptional, IsEnum, IsInt } from 'class-validator';
import { statut_connexion_enum } from '@prisma/client';

export class CreateConnexionDto {
  @IsOptional()
  @IsString()
  telephone?: string;

  @IsOptional()
  @IsString()
  mot_de_passe?: string;

  @IsOptional()
  @IsString()
  coderecup?: string;

  @IsOptional()
  @IsEnum(statut_connexion_enum)
  statutconnexion?: statut_connexion_enum;

  @IsOptional()
  @IsInt()
  idpersonne?: number;
}
