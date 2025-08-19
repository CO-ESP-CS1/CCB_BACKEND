import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpResetPasswordDto {
  @ApiProperty({
    description: 'Numéro de téléphone de l’utilisateur',
    example: '+221770000000',
  })
  @IsString()
  @IsNotEmpty()
  telephone: string;

  @ApiProperty({
    description: 'Identifiant unique du device de l’utilisateur',
    example: 'DEVICE98765',
  })
  @IsString()
  @IsNotEmpty()
  deviceid: string;

  @ApiProperty({
    description: 'Code OTP envoyé pour la vérification',
    example: '654321',
  })
  @IsString()
  @IsNotEmpty()
  codeotp: string;

  @ApiProperty({
    description: 'Nouveau mot de passe choisi par l’utilisateur',
    example: 'NouveauMotDePasse123',
  })
  @IsString()
  @IsNotEmpty()
  nouveau_mot_de_passe: string;
}
