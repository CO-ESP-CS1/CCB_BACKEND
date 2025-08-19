// src/profilassemblee/dto/create-profilassemblee.dto.ts
import { IsInt, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateProfilassembleeDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  photourl?: string;

  @IsOptional()
  @IsUrl()
  couvertureurl?: string;

  @IsInt()
  idassemblee: number;
}