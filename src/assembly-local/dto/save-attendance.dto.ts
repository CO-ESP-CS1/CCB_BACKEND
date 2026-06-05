import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsInt, IsString } from 'class-validator';

export class SaveAttendanceDto {
  @ApiProperty({ example: '2026-06-05' })
  @IsDateString()
  date: string;

  @ApiProperty({ type: [Number], description: 'IDs membres (application)' })
  @IsArray()
  @IsInt({ each: true })
  membreIds: number[];

  @ApiProperty({ type: [String], description: 'IDs nouvelles âmes (évangélisation)' })
  @IsArray()
  @IsString({ each: true })
  soulIds: string[];

  @ApiProperty({ type: [String], description: 'IDs serviteurs sans application' })
  @IsArray()
  @IsString({ each: true })
  helperIds: string[];
}
