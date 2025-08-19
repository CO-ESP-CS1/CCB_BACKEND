import { ApiProperty } from '@nestjs/swagger';

export class MembreResponseDto {
  @ApiProperty()
  idmembre: number;

  @ApiProperty({ required: false })
  codemembre?: string;

  @ApiProperty({ required: false })
  solde?: string;

  @ApiProperty({ required: false, type: String, format: 'date' })
  dateadhesion?: Date;

  @ApiProperty({ required: false })
  statutmembre?: string;

  @ApiProperty()
  idassemblee: number;

  @ApiProperty()
  idpersonne: number;

  @ApiProperty()
  createat: Date;

  @ApiProperty()
  updateat: Date;
}
