import { IsOptional, IsString, IsNumber, IsDate, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';


export enum StatutMembreEnum {
  ACTIF = 'ACTIF',
  inactif = 'inactif'
  // ajoute les valeurs exactes selon ton enum Prisma
}


export enum role_enum {
  PASTEUR = 'pasteur',
  MEMBRE = 'membre',
  APOTRE = 'apotre',
  DIACRE = 'diacre',
  ANCIEN = 'ancien',
  PATRIARCHE = 'patriarche',
}


export class CreateMembreDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  codemembre?: string;

  @ApiProperty({ required: false, type: String, format: 'decimal' })
  @IsOptional()
  solde?: string; // Prisma Decimal est manipulé comme string

  @ApiProperty({ required: false, type: 'string', format: 'date' })
  @IsOptional()
  @IsDate()
  @Type(() => Date) // 👈 C’EST CETTE LIGNE QUI MANQUE
  dateadhesion?: Date;

  @ApiProperty({ enum: StatutMembreEnum, required: false })
  @IsOptional()
  @IsEnum(StatutMembreEnum)
  statutmembre?: StatutMembreEnum;
  
  @ApiProperty({ enum: role_enum, required: false })
@IsOptional()
@IsEnum(role_enum)
role?: role_enum;


  @ApiProperty()
  @IsNumber()
  idassemblee: number;

  @ApiProperty()
  @IsNumber()
  idpersonne: number;
}
