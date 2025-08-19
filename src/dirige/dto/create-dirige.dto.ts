import { IsDateString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDirigeDto {
  @ApiProperty()
  @IsInt()
  idmembre: number;

  @ApiProperty()
  @IsInt()
  iddepartement: number;

  @ApiProperty({ required: false })
  @IsDateString()
  datedebut?: string;
}
