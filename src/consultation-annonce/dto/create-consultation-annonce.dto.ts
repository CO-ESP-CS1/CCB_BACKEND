import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreateConsultationAnnonceDto {
  @ApiProperty({
    description: 'Identifiant du membre qui consulte l’annonce',
    example: 1,
  })
  @IsInt()
  idmembre: number;

  @ApiProperty({
    description: 'Identifiant de l’annonce consultée',
    example: 10,
  })
  @IsInt()
  idannonce: number;
}
