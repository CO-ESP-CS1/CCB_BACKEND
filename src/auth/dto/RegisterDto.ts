import { IsString, IsDateString, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsString()
  nom: string;

  @IsString()
  prenom: string;

  @IsString()
  telephone: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsString()
  sexe: string;

  @IsDateString()
  datenaissance: string;

  @IsString()
  mot_de_passe: string;

  @IsOptional()
  idassemblee?: number;

  @IsOptional()
  @IsString()
  deviceid?: string;

  @IsOptional()
  @IsString()
  useragent?: string;

  @IsOptional()
  @IsString()
  ipadresse?: string;
}
