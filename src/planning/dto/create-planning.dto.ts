import { IsOptional, IsString, IsDateString, IsEnum } from 'class-validator';
import { etat_planning_enum, statut_planning_enum, type_planning_enum  } from '@prisma/client';

export class CreatePlanningDto {
  @IsOptional()
  @IsEnum(type_planning_enum)
  typeplanning?: type_planning_enum;


  @IsOptional()
  @IsDateString()
  datedebut?: string;
  
  @IsOptional()
  @IsDateString()
  datefin?: string;
  

  @IsOptional()
  @IsEnum(etat_planning_enum)
  etatplanning?: etat_planning_enum;

  @IsOptional()
  @IsString()
  titreplanning?: string;

  @IsOptional()
  @IsString()
  descriptionplanning?: string;

  @IsOptional()
  @IsEnum(statut_planning_enum)
  statutplanning?: statut_planning_enum;
}
