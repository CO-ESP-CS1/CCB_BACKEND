import { ApiProperty } from '@nestjs/swagger';
import { interaction_type_enum } from '@prisma/client';

export class InteractionResponseDto {
  @ApiProperty()
  idinteraction: number;

  @ApiProperty({ enum: interaction_type_enum, required: false })
  type?: interaction_type_enum;

  @ApiProperty({ required: false })
  ressourcetype?: string;

  @ApiProperty({ required: false })
  ressourceid?: number;

  @ApiProperty({ required: false })
  contenu?: string;

  @ApiProperty()
  idmembre: number;

  @ApiProperty()
  createat: Date;

  @ApiProperty()
  updateat: Date;
}
