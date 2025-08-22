import { IsString, IsOptional, IsDate, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCotisationDto {
  @IsString()
  titre: string;

  @IsString()
  @IsOptional()
  description?: string;

  @Type(() => Date) // transforme string => Date
  @IsDate()
  date_debut: Date;

  @Type(() => Date) // transforme string => Date
  @IsDate()
  date_fin: Date;

  @IsInt()
  idassemblee: number;
}
