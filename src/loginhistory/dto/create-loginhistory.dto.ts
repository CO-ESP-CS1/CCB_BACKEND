import { IsDate, IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLoginHistoryDto {
  @ApiProperty()
  @IsInt()
  personnelid: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  ipadresse?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  useragent?: string;

  @ApiProperty({ required: false, type: String, format: 'date-time' })
  @IsOptional()
  logintime?: Date;

  @ApiProperty({ required: false, type: String, format: 'date-time' })
  @IsOptional()
  logouttime?: Date;
}
