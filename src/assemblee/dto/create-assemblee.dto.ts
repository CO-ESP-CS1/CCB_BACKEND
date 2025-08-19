import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateAssembleeDto {
  @IsString()
  @IsOptional()
  nomassemble?: string;

  @IsString()
  @IsOptional()
  adresseassemblee?: string;

  @IsString()
  @IsOptional()
  zone?: string;

  @IsInt()
  idarrondissement: number;
}
