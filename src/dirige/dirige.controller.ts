import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DirigeService } from './dirige.service';
import { CreateDirigeDto } from './dto/create-dirige.dto';
import { UpdateDirigeDto } from './dto/update-dirige.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('Dirige')
@Controller('dirige')
export class DirigeController {
  constructor(private readonly dirigeService: DirigeService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une direction (dirige)' })
  create(@Body() dto: CreateDirigeDto) {
    return this.dirigeService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister toutes les directions (dirige)' })
  findAll() {
    return this.dirigeService.findAll();
  }

  @Get(':idmembre/:iddepartement')
  @ApiOperation({ summary: 'Afficher une direction spécifique' })
  @ApiParam({ name: 'idmembre', type: Number })
  @ApiParam({ name: 'iddepartement', type: Number })
  findOne(
    @Param('idmembre') idmembre: number,
    @Param('iddepartement') iddepartement: number,
  ) {
    return this.dirigeService.findOne(+idmembre, +iddepartement);
  }

  @Patch(':idmembre/:iddepartement')
  @ApiOperation({ summary: 'Mettre à jour une direction' })
  update(
    @Param('idmembre') idmembre: number,
    @Param('iddepartement') iddepartement: number,
    @Body() dto: UpdateDirigeDto,
  ) {
    return this.dirigeService.update(+idmembre, +iddepartement, dto);
  }

  @Delete(':idmembre/:iddepartement')
  @ApiOperation({ summary: 'Supprimer une direction' })
  remove(
    @Param('idmembre') idmembre: number,
    @Param('iddepartement') iddepartement: number,
  ) {
    return this.dirigeService.remove(+idmembre, +iddepartement);
  }
}
