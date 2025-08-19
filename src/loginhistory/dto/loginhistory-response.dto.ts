import { ApiProperty } from '@nestjs/swagger';

export class LoginHistoryResponseDto {
  @ApiProperty()
  idloginhistory: number;

  @ApiProperty()
  personnelid: number;

  @ApiProperty({ required: false })
  ipadresse?: string;

  @ApiProperty({ required: false })
  useragent?: string;

  @ApiProperty({ required: false, type: String, format: 'date-time' })
  logintime?: Date;

  @ApiProperty({ required: false, type: String, format: 'date-time' })
  logouttime?: Date;

  @ApiProperty()
  createat: Date;

  @ApiProperty()
  updateat: Date;
}
