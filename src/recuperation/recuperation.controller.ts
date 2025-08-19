import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './recuperation.service';
import { RecoveryDto } from './dto/recovery.dto';
import { VerifyOtpDto } from './dto/VerifyOtpDto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyOtpResetPasswordDto } from './dto/verify-otp-reset-password.dto';
import { ForgotPasswordDifferentDeviceDto } from './dto/forgot-password-different-device.dto';
import { VerifyOtpResetPasswordDifferentDeviceDto } from './dto/VerifyOtpResetPasswordDifferentDeviceDto';
import { Public } from '../auth/public.decorator';

@ApiTags('Récupération') // Groupe Swagger
@Controller('recuperation')
export class RecuperationController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Démarrer la récupération de compte' })
  @ApiResponse({ status: 201, description: 'Récupération initiée.' })
  @ApiResponse({ status: 400, description: 'Paramètres invalides.' })
  async startRecovery(@Body() dto: RecoveryDto) {
    return this.authService.startRecovery(dto.telephone, dto.mot_de_passe, dto.coderecup, dto.deviceid);
  }

  @Public()
  @Post('verify-otp')
  @ApiOperation({ summary: 'Vérifier le code OTP' })
  @ApiResponse({ status: 200, description: 'OTP vérifié avec succès.' })
  @ApiResponse({ status: 400, description: 'Téléphone ou code OTP manquant.' })
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    if (!dto.telephone || !dto.codeotp) {
      throw new BadRequestException('Téléphone et code OTP sont obligatoires');
    }
    return this.authService.verifyOtp(dto.telephone, dto.codeotp, dto.deviceid);
  }

  @Public()
  @Post('forgot-password')
  @ApiOperation({ summary: 'Demander une réinitialisation de mot de passe' })
  @ApiResponse({ status: 200, description: 'Lien ou code envoyé pour réinitialisation.' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.telephone, dto.coderecup, dto.deviceid);
  }

  @Public()
  @Post('verify-otp-reset-password')
  @ApiOperation({ summary: 'Vérifier OTP et réinitialiser le mot de passe' })
  @ApiResponse({ status: 200, description: 'Mot de passe réinitialisé avec succès.' })
  @ApiResponse({ status: 400, description: 'Champs obligatoires manquants.' })
  async verifyOtpResetPassword(@Body() dto: VerifyOtpResetPasswordDto) {
    const { telephone, deviceid, codeotp, nouveau_mot_de_passe } = dto;

    if (!telephone || !deviceid || !codeotp || !nouveau_mot_de_passe) {
      throw new BadRequestException('Tous les champs sont obligatoires');
    }

    return this.authService.verifyOtpAndResetPassword(
      telephone,
      deviceid,
      codeotp,
      nouveau_mot_de_passe,
    );
  }

  @Public()
  @Post('forgot-password-different-device')
  @ApiOperation({ summary: 'Réinitialisation mot de passe depuis un autre appareil' })
  @ApiResponse({ status: 200, description: 'Demande acceptée.' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async forgotPasswordDifferentDevice(@Body() dto: ForgotPasswordDifferentDeviceDto) {
    return this.authService.forgotPasswordDifferentDevice(dto.telephone, dto.coderecup, dto.deviceid);
  }

  @Public()
  @Post('verify-otp-reset-password-different-device')
  @ApiOperation({ summary: 'Vérifier OTP et réinitialiser (autre appareil)' })
  @ApiResponse({ status: 200, description: 'Mot de passe réinitialisé avec succès.' })
  async verifyOtpResetPasswordDifferentDevice(
    @Body() dto: VerifyOtpResetPasswordDifferentDeviceDto,
  ) {
    return this.authService.verifyOtpResetPasswordDifferentDevice(
      dto.telephone,
      dto.deviceid,
      dto.codeotp,
      dto.nouveau_mot_de_passe,
    );
  }
}
