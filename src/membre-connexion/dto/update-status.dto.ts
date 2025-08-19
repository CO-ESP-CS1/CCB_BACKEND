import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { statut_membre_enum, statut_connexion_enum } from '@prisma/client';

export class UpdateStatusDto {
  @ApiProperty({
    enum: ['valider', 'refuser', 'suspendre'],
    description: 'Action à effectuer sur le membre'
  })
  @IsEnum(['valider', 'refuser', 'suspendre'])
  action: 'valider' | 'refuser' | 'suspendre';
}