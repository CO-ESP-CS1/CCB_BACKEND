import { IsString, Length, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpResetPasswordDifferentDeviceDto {
  @ApiProperty({
    description: 'Numéro de téléphone de l’utilisateur',
    example: '+221770000000',
  })
  @IsString()
  @IsNotEmpty()
  telephone: string;

  @ApiProperty({
    description: 'Identifiant unique du device',
    example: 'DEVICE12345',
  })
  @IsString()
  @IsNotEmpty()
  deviceid: string;

  @ApiProperty({
    description: 'Code OTP à 6 caractères',
    example: '123456',
    minLength: 6,
    maxLength: 6,
  })
  @IsString()
  @Length(6, 6)
  codeotp: string;

  @ApiProperty({
    description: 'Nouveau mot de passe',
    example: 'NouveauMotDePasse123',
  })
  @IsString()
  @IsNotEmpty()
  nouveau_mot_de_passe: string;
}
