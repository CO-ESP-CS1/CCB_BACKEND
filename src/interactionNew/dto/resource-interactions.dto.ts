import { IsString, IsInt, IsOptional } from 'class-validator';

export class ResourceInteractionsDto {
  @IsString()
  ressourcetype: 'publication' | 'live';

  @IsInt()
  ressourceid: number;

  @IsOptional()
  @IsString()
  interactionType?: string; // Optionnel pour filtrer par type
}