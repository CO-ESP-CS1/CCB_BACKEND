import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RecoveryDto {
  @ApiProperty({
    description: 'Numéro de téléphone de l’utilisateur',
    example: '+221770000000',
  })
  @IsString()
  telephone: string;

  @ApiProperty({
    description: 'Mot de passe actuel ou nouveau mot de passe',
    example: 'MonMotDePasse123',
  })
  @IsString()
  mot_de_passe: string;

  @ApiProperty({
    description: 'Code de récupération envoyé à l’utilisateur',
    example: 'ABC123',
  })
  @IsString()
  coderecup: string;

  @ApiPropertyOptional({
    description: 'Identifiant unique de l’appareil (optionnel)',
    example: 'DEVICE12345',
  })
  @IsOptional()
  @IsString()
  deviceid?: string;
}
