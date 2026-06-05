import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateEvangelizationSoulDto {
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

  @ApiProperty()
  @IsBoolean()
  baptise: boolean;

  @ApiProperty({ description: 'Nom de la personne qui a invité' })
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  invitePar: string;
}
