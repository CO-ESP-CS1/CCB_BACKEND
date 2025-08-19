import { IsDateString, IsInt, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateActiviteDto1 {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  libelleactivite?: string;

  @ApiProperty()
  @IsString()
  descriptionactivite: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  datedebut?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  datefin?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageurl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  statutactivite?: string;

  @ApiProperty()
  @IsInt()
  idtypeactivites: number;
}
