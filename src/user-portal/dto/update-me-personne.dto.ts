import { IsDateString, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateMePersonneDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  nom?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  prenom?: string;

  @IsOptional()
  @IsIn(['M', 'F'])
  sexe?: string;

  @IsOptional()
  @IsDateString()
  datenaissance?: string;
}
