import { IsString, IsOptional } from 'class-validator';

export class LoginDto {
  @IsString()
  telephone: string;

  @IsString()
  mot_de_passe: string;

  @IsString()
  deviceid: string;

  @IsOptional()
  @IsString()
  useragent?: string;

  @IsOptional()
  @IsString()
  ipadresse?: string;
}
