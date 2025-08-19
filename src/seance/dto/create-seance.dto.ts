import { IsOptional, IsString, IsInt, IsDate, IsEnum } from 'class-validator';
import { statut_seance_enum } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateSeanceDto {
  @IsOptional()
  @IsString()
  titreseance?: string;

  @IsOptional()
  @IsString()
  descriptionseance?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  heuredebut?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  heurefin?: Date;

  @IsOptional()
  @IsString()
  lieu?: string;

  @IsOptional()
  @IsEnum(statut_seance_enum)
  statutseance?: statut_seance_enum;

  @IsInt()
  idactivite: number;

  @IsInt()
  idplanning: number;

  @IsOptional()
  @IsInt()
  idintervenant?: number;
}