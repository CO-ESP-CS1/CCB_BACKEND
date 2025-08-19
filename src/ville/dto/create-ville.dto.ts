// create-ville.dto.ts
import { IsOptional, IsString, IsInt } from 'class-validator';

export class CreateVilleDto {
  @IsOptional()
  @IsString()
  nomville?: string;

  @IsInt()
  idpays: number;
}
