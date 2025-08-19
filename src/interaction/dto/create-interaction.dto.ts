import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { interaction_type_enum } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInteractionDto {
  @ApiProperty({ enum: interaction_type_enum, required: false })
  @IsOptional()
  @IsEnum(interaction_type_enum)
  type?: interaction_type_enum;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  ressourcetype?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  ressourceid?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  contenu?: string;

  @ApiProperty()
  @IsInt()
  idmembre: number;
}
