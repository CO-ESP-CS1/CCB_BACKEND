import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateDepartementDto {
  @IsOptional()
  @IsString()
  nomdepartement?: string;

  @IsOptional()
  @IsString()
  responsable?: string;

  @IsOptional()
  @IsInt()
  idassemblee?: number;
}
