import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class UpdateFinanceDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  libelle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  montant?: number;

  @ApiPropertyOptional({ description: 'Déplacer vers un autre grand poste' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  postId?: string;
}
