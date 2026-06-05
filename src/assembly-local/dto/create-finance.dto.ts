import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNumber, IsString, MaxLength, Min, MinLength } from 'class-validator';

export enum FinanceType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export class CreateFinanceDto {
  @ApiProperty({ enum: FinanceType })
  @IsEnum(FinanceType)
  type: FinanceType;

  @ApiProperty({ example: '2026-06-05' })
  @IsDateString()
  date: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  libelle: string;

  @ApiProperty()
  @IsNumber()
  @Min(0.01)
  montant: number;

  @ApiProperty({ description: 'ID du grand poste' })
  @IsString()
  @MinLength(1)
  postId: string;
}
