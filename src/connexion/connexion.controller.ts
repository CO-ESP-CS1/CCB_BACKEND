import { Controller, Get, Post, Body, Patch, Param, Delete, UnauthorizedException } from '@nestjs/common';
import { ConnexionService } from './connexion.service';
import { CreateConnexionDto } from './dto/create-connexion.dto';
import { UpdateConnexionDto } from './dto/update-connexion.dto';
import { UserPayload } from '../auth/user-payload.decorator';

@Controller('connexion')
export class ConnexionController {
  constructor(private readonly service: ConnexionService) {}

  @Post()
  create(@Body() data: CreateConnexionDto) {
    return this.service.create(data);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateConnexionDto) {
    return this.service.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }


   @Get('me/recovery-code')
  async getMyRecoveryCode(@UserPayload('idmembre') idmembreFromToken: number | string) {
    if (!idmembreFromToken) {
      throw new UnauthorizedException('idmembre absent du token');
    }

    const idmembre = typeof idmembreFromToken === 'string'
      ? parseInt(idmembreFromToken, 10)
      : idmembreFromToken;

    if (!idmembre || Number.isNaN(idmembre)) {
      throw new UnauthorizedException('idmembre invalide dans le token');
    }

    return this.service.getRecoveryCodeByMembreId(Number(idmembre));
  }
}
