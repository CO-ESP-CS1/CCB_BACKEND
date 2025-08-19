import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class AssignBadgeByIdDto {
  @ApiProperty({ description: 'ID du membre' })
  @IsInt()
  idmembre: number;

  @ApiProperty({ description: 'ID du badge' })
  @IsInt()
  idbadge: number;
}