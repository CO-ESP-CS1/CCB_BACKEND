import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class CreateParticipationDto {
  @ApiProperty({ description: 'ID du membre à noter' })
  @IsInt()
  @IsNotEmpty()
  idmembre: number;

  @ApiProperty({ description: 'ID de la séance' })
  @IsInt()
  @IsNotEmpty()
  idseance: number;

}