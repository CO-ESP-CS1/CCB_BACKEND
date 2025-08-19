import { ApiProperty } from '@nestjs/swagger';

export class IntervenantResponseDto {
  @ApiProperty()
  idintervenant: number;

  @ApiProperty({ required: false })
  nomintervenant?: string;

  @ApiProperty({ required: false })
  prenomintervenant?: string;

  @ApiProperty({ required: false })
  idmembre?: number;

  @ApiProperty()
  createat: Date;

  @ApiProperty()
  updateat: Date;
}
