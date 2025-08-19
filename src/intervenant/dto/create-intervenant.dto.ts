import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIntervenantDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  nomintervenant?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  prenomintervenant?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  idmembre?: number;
}
