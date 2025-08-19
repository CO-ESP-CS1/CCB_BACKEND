import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegenerateRecoveryCodeDto {
  @ApiProperty({
    description: 'Numéro de téléphone de l’utilisateur',
    example: '+221770000000',
  })
  @IsNotEmpty()
  @IsString()
  telephone: string;

  @ApiProperty({
    description: 'Mot de passe utilisateur',
    example: 'MonMotDePasse123',
  })
  @IsNotEmpty()
  @IsString()
  mot_de_passe: string;

  @ApiProperty({
    description: 'Identifiant unique du device',
    example: 'DEVICE12345',
  })
  @IsNotEmpty()
  @IsString()
  deviceid: string;
}
