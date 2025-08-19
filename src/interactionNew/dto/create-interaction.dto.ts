import { IsEnum, IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';
import { interaction_type_enum } from '@prisma/client';

export class CreateInteractionNewDto {
  @IsEnum(interaction_type_enum)
  type: interaction_type_enum;

  @IsOptional()
  @IsString()
  ressourcetype: string;

  @IsOptional()
  @IsInt()
  ressourceid?: number;

  @IsOptional()
  @IsString()
  contenu?: string;

  // Validation conditionnelle pour les commentaires et signalements
  validateContent() {
    if (
      (this.type === 'commentaire' || this.type === 'signale') &&
      !this.contenu
    ) {
      throw new Error(
        'Le contenu est obligatoire pour les commentaires et signalements',
      );
    }
  }
}