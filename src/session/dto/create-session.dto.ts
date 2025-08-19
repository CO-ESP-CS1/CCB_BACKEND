// src/session/dto/create-session.dto.ts
import { IsOptional, IsString, IsInt, IsEnum } from 'class-validator';
import { statut_session_enum } from '@prisma/client';

export class CreateSessionDto {
  @IsOptional()
  @IsString()
  telephone?: string;

  @IsOptional()
  @IsString()
  deviceid?: string;

  @IsOptional()
  @IsString()
  useragent?: string;

  @IsOptional()
  @IsString()
  ipadresse?: string;

  @IsOptional()
  @IsEnum(statut_session_enum)
  statutsession?: statut_session_enum;

  @IsInt()
  connexionid: number;
}