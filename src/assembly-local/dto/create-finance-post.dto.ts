import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateFinancePostDto {
  @ApiProperty({ example: 'Culte du dimanche 30 juin' })
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  libelle: string;

  @ApiProperty({ example: '2026-06-30' })
  @IsDateString()
  date: string;
}
