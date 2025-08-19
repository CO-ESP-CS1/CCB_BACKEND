import { IsOptional, IsString, IsEmail, IsDateString } from 'class-validator';

export class CreatePersonneDto {
  @IsOptional()
  @IsString()
  nom?: string;

  @IsOptional()
  @IsString()
  prenom?: string;

  @IsOptional()
  @IsString()
  telephone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  sexe?: string;

  @IsOptional()
  @IsDateString()
  datenaissance?: Date;
}
