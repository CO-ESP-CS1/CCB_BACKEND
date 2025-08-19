import { IsOptional, IsString, IsUrl, IsInt } from 'class-validator';

export class CreateProfilDepartementDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  photourl?: string;

  @IsOptional()
  @IsUrl()
  couvertureurl?: string;

  @IsOptional()
  @IsInt()
  iddepartement?: number;
}