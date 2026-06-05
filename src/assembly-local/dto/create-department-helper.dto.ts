import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateDepartmentHelperDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  prenom: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  nom: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(120)
  age: number;

  @ApiProperty({ description: 'Libellé du département de service' })
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  departementLibelle: string;
}
