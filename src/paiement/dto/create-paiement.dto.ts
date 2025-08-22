import { IsInt, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreatePaiementDto {
  @IsInt()
  idmembre: number;

  @IsInt()
  idcotisation: number;

  @IsNumber()
  montant: number;

  @IsString()
  @IsOptional()
  code_transaction?: string;

  @IsString()
  @IsOptional()
  statut?: string;
}