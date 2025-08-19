// src/typeactivites/dto/create-typeactivites.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class CreateTypeactivitesDto {
  @IsOptional()
  @IsString()
  nomtypeactivite?: string;
}