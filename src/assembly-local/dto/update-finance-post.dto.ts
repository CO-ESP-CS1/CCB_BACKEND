import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateFinancePostDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  libelle: string;
}
