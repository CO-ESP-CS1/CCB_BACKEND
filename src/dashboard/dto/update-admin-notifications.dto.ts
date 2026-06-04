import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class AdminNotificationInputDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  id: string;

  @ApiProperty({ example: 'Culte ce dimanche' })
  @IsString()
  @MaxLength(120)
  title: string;

  @ApiProperty({ example: 'Rejoignez-nous à 10h pour le culte en direct.' })
  @IsString()
  @MaxLength(500)
  body: string;

  @ApiProperty({ example: '2026-06-08T10:00:00.000Z' })
  @IsDateString()
  scheduledAt: string;

  @ApiProperty({ required: false, example: '/live' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  linkRoute?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  order?: number;
}

export class UpdateAdminNotificationsDto {
  @ApiProperty({ type: [AdminNotificationInputDto] })
  @IsArray()
  @ArrayMaxSize(30)
  @ValidateNested({ each: true })
  @Type(() => AdminNotificationInputDto)
  notifications: AdminNotificationInputDto[];
}
