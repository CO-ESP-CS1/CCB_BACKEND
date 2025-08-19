import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProfilDepartementDto {
  @ApiProperty({
    description: 'Description du profil',
    example: 'Département de développement logiciel',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;
}