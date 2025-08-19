import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Numéro de téléphone de l’utilisateur',
    example: '+221770000000',
  })
  @IsString()
  @IsNotEmpty()
  telephone: string;

  @ApiProperty({
    description: 'Code de récupération envoyé à l’utilisateur',
    example: 'XYZ789',
  })
  @IsString()
  @IsNotEmpty()
  coderecup: string;

  @ApiProperty({
    description: 'Identifiant unique du device de l’utilisateur',
    example: 'DEVICE98765',
  })
  @IsString()
  @IsNotEmpty()
  deviceid: string;
}
