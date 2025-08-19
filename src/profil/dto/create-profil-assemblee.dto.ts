import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateProfilAssembleeDto {
  @ApiProperty({ description: "ID de l'assemblée" })
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  idassemblee: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}