// src/profilpersonne/dto/create-profilpersonne.dto.ts
import { IsOptional, IsString, IsInt, IsUrl } from 'class-validator';

export class CreateProfilPersonneDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  adresse?: string;

  @IsOptional()
  @IsUrl()
  photourl?: string;

  @IsOptional()
  @IsUrl()
  couvertureurl?: string;

  @IsInt()
  idpersonne: number;
}