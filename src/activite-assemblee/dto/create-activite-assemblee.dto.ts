import { IsDateString, IsInt, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateActiviteAssembleeDto1 {
  @ApiProperty()
  @IsInt()
  idactivite: number;

  @ApiProperty()
  @IsInt()
  idassemblee: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dateprevue?: string;
}
