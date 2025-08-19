import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ActiviteAssembleeService } from './activite-assemblee.service';
import { CreateActiviteAssembleeDto1 } from './dto/create-activite-assemblee.dto';
import { UpdateActiviteAssembleeDto } from './dto/update-activite-assemblee.dto';

@ApiTags('activite-assemblee')
@Controller('activite-assemblee')
export class ActiviteAssembleeController {
  constructor(private readonly service: ActiviteAssembleeService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une relation activité-assemblée' })
  create(@Body() dto: CreateActiviteAssembleeDto1) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les relations activité-assemblée' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':idactivite/:idassemblee')
  @ApiOperation({ summary: 'Récupérer une relation par ses IDs' })
  findOne(
    @Param('idactivite', ParseIntPipe) idactivite: number,
    @Param('idassemblee', ParseIntPipe) idassemblee: number,
  ) {
    return this.service.findOne(idactivite, idassemblee);
  }

  @Patch(':idactivite/:idassemblee')
  @ApiOperation({ summary: 'Mettre à jour une relation activité-assemblée' })
  update(
    @Param('idactivite', ParseIntPipe) idactivite: number,
    @Param('idassemblee', ParseIntPipe) idassemblee: number,
    @Body() dto: UpdateActiviteAssembleeDto,
  ) {
    return this.service.update(idactivite, idassemblee, dto);
  }

  @Delete(':idactivite/:idassemblee')
  @ApiOperation({ summary: 'Supprimer une relation activité-assemblée' })
  remove(
    @Param('idactivite', ParseIntPipe) idactivite: number,
    @Param('idassemblee', ParseIntPipe) idassemblee: number,
  ) {
    return this.service.remove(idactivite, idassemblee);
  }
}
