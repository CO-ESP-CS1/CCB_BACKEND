import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDifferentDeviceDto {
  @ApiProperty({
    description: 'Numéro de téléphone de l’utilisateur',
    example: '+221770000000',
  })
  @IsString()
  @IsNotEmpty()
  telephone: string;

  @ApiProperty({
    description: 'Code de récupération généré pour réinitialisation',
    example: 'ABC123',
  })
  @IsString()
  @IsNotEmpty()
  coderecup: string;

  @ApiProperty({
    description: 'Identifiant unique du nouvel appareil',
    example: 'DEVICE12345',
  })
  @IsString()
  @IsNotEmpty()
  deviceid: string;
}
