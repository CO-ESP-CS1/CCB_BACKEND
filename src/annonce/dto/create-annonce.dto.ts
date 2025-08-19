import { IsDateString, IsEnum, IsInt, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { priorite_annonce_enum, statut_annonce_enum } from '@prisma/client';

export class CreateAnnonceDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  titreannonce?: string;

  @ApiProperty()
  @IsString()
  descriptionannonce: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageurl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  datepublication?: string;

  @ApiPropertyOptional({ enum: priorite_annonce_enum })
  @IsOptional()
  @IsEnum(priorite_annonce_enum)
  priorite?: priorite_annonce_enum;

  @ApiPropertyOptional({ enum: statut_annonce_enum })
  @IsOptional()
  @IsEnum(statut_annonce_enum)
  statutannonce?: statut_annonce_enum;

  @ApiProperty()
  @IsInt()
  idmembre: number;

  @ApiProperty()
  @IsInt()
  idtypeannonce: number;
}
