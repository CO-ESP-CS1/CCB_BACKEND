// src/typeannonce/dto/create-typeannonce.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class CreateTypeannonceDto {
  @IsOptional()
  @IsString()
  nomtypeannonce?: string;
}
