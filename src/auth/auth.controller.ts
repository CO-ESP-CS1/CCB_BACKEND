import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common'; // <-- Ajout ici
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/RegisterDto';
import { LoginDto } from './dto/login.dto';
import { Public } from '../auth/public.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LogoutDto } from './dto/LogoutDto';
import { AuthGuard } from '../auth/auth.guard';
import { Request as ExpressRequest } from 'express'; // <-- OK pour typer la requête si besoin

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto) {
    console.log('login dto reçu:', dto);
    return this.authService.login(
      dto.telephone,
      dto.mot_de_passe,
      dto.deviceid,
      dto.useragent,
      dto.ipadresse,
    );
  }

 @UseGuards(AuthGuard)
@Post('logout')
async logout(@Request() req: ExpressRequest, @Body() dto: LogoutDto) {
  const telephone = (req as any).user.telephone; // Injecté par le guard
  const { deviceid } = dto;
  return this.authService.logout(telephone, deviceid);
}

}
