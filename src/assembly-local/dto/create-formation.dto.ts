import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateFormationDto {
  @ApiProperty({ example: 'Formation sur le leadership' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  titre: string;

  @ApiProperty({ example: 'Support de cours pour les responsables de département.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description: string;
}
