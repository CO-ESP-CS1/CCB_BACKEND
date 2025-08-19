import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProfilAssembleeDto {
  @ApiProperty({
    description: 'Description du profil',
    example: 'Assemblée générale annuelle 2023',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;
}