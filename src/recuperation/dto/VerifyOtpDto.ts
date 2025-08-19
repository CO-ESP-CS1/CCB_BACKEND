import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({
    description: 'Numéro de téléphone de l’utilisateur',
    example: '+221770000000',
  })
  @IsString()
  telephone: string;

  @ApiProperty({
    description: 'Code OTP envoyé à l’utilisateur',
    example: '123456',
  })
  @IsString()
  codeotp: string;

  @ApiPropertyOptional({
    description: 'Identifiant unique du device (optionnel)',
    example: 'DEVICE12345',
  })
  @IsOptional()
  @IsString()
  deviceid?: string;
}
