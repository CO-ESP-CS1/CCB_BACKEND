import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LogoutDto {
  @ApiProperty({ example: 'device-1234abcd', description: 'Identifiant du device' })
  @IsString()
  deviceid: string;
}
