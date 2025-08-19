import { ApiProperty } from '@nestjs/swagger';
import { BadgeWithDateDto } from './badge-with-date.dto';

export class BadgesPaginationDto {
  @ApiProperty({ example: 123 })
  total: number;

  @ApiProperty({ description: 'Limite demandée (null si non fournie)', example: 10, nullable: true })
  limit: number | null;

  @ApiProperty({ description: 'Offset (skip)', example: 0 })
  offset: number;
}

export class BadgesListDto {
  @ApiProperty({ type: [BadgeWithDateDto] })
  data: BadgeWithDateDto[];

  @ApiProperty({ type: BadgesPaginationDto })
  pagination: BadgesPaginationDto;
}
