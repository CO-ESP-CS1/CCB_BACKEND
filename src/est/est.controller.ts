import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EstService } from './est.service';
import { CreateEstDto } from './dto/create-est.dto';
import { UpdateEstDto } from './dto/update-est.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('Est')
@Controller('est')
export class EstController {
  constructor(private readonly estService: EstService) {}

  @Post()
  @ApiOperation({ summary: "Créer une attribution 'est'" })
  create(@Body() dto: CreateEstDto) {
    return this.estService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister toutes les attributions' })
  findAll() {
    return this.estService.findAll();
  }

  @Get(':idmembre/:iddepartement')
  @ApiOperation({ summary: 'Afficher une attribution spécifique' })
  @ApiParam({ name: 'idmembre', type: Number })
  @ApiParam({ name: 'iddepartement', type: Number })
  findOne(
    @Param('idmembre') idmembre: number,
    @Param('iddepartement') iddepartement: number,
  ) {
    return this.estService.findOne(+idmembre, +iddepartement);
  }

  @Patch(':idmembre/:iddepartement')
  @ApiOperation({ summary: 'Modifier une attribution' })
  update(
    @Param('idmembre') idmembre: number,
    @Param('iddepartement') iddepartement: number,
    @Body() dto: UpdateEstDto,
  ) {
    return this.estService.update(+idmembre, +iddepartement, dto);
  }

  @Delete(':idmembre/:iddepartement')
  @ApiOperation({ summary: 'Supprimer une attribution' })
  remove(
    @Param('idmembre') idmembre: number,
    @Param('iddepartement') iddepartement: number,
  ) {
    return this.estService.remove(+idmembre, +iddepartement);
  }
}
