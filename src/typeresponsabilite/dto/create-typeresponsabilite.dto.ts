// src/typeresponsabilite/dto/create-typeresponsabilite.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTyperesponsabiliteDto {
  @ApiProperty({ description: 'Libellé du type de responsabilité' })
  @IsNotEmpty()
  @IsString()
  libelletyperesponsabilite: string;
}