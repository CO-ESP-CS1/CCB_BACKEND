import { ApiProperty } from '@nestjs/swagger';
import { publication_action_enum } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf } from 'class-validator';

export class CreatePublicationActionNewDto {
  @ApiProperty({
    enum: ['valide', 'rejete', 'archive', 'signale', 'modifie', 'en_attente'],
    description: 'Type d\'action à effectuer'
  })
  @IsEnum(['valide', 'rejete', 'archive', 'signale', 'modifie', 'en_attente'])
  action: publication_action_enum;

  @ApiProperty({ description: 'ID de la publication concernée' })
  @IsNumber()
  @IsNotEmpty()
  idpublication: number;

  @ApiProperty({
    required: false,
    description: 'Motif obligatoire pour les actions "rejete" et "signale"'
  })
  @ValidateIf(o => ['rejete', 'signale'].includes(o.action))
  @IsString()
  @IsNotEmpty()
  motif?: string;
}