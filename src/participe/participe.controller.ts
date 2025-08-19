import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParticipeService } from './participe.service';
import { CreateParticipeDto } from './dto/create-participe.dto';
import { UpdateParticipeDto } from './dto/update-participe.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('participe')
@Controller('participe')
export class ParticipeController {
  constructor(private readonly service: ParticipeService) {}

  @Post()
  create(@Body() dto: CreateParticipeDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':idmembre/:idseance')
  findOne(@Param('idmembre') idmembre: string, @Param('idseance') idseance: string) {
    return this.service.findOne(+idmembre, +idseance);
  }

  @Patch(':idmembre/:idseance')
  update(
    @Param('idmembre') idmembre: string,
    @Param('idseance') idseance: string,
    @Body() dto: UpdateParticipeDto,
  ) {
    return this.service.update(+idmembre, +idseance, dto);
  }

  @Delete(':idmembre/:idseance')
  remove(@Param('idmembre') idmembre: string, @Param('idseance') idseance: string) {
    return this.service.remove(+idmembre, +idseance);
  }
}
