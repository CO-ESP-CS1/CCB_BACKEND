import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { AnnonceAssembleeService } from './annonce-assemblee.service';
import { CreateAnnonceAssembleeDto } from './dto/create-annonce-assemblee.dto';
import { UpdateAnnonceAssembleeDto } from './dto/update-annonce-assemblee.dto';

@Controller('annonce-assemblee')
export class AnnonceAssembleeController {
  constructor(private readonly service: AnnonceAssembleeService) {}

  @Post()
  create(@Body() data: CreateAnnonceAssembleeDto) {
    return this.service.create(data);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':idannonce/:idassemblee')
  findOne(@Param('idannonce') idannonce: string, @Param('idassemblee') idassemblee: string) {
    return this.service.findOne(+idannonce, +idassemblee);
  }

  @Patch(':idannonce/:idassemblee')
  update(
    @Param('idannonce') idannonce: string,
    @Param('idassemblee') idassemblee: string,
    @Body() data: UpdateAnnonceAssembleeDto,
  ) {
    return this.service.update(+idannonce, +idassemblee, data);
  }

  @Delete(':idannonce/:idassemblee')
  remove(@Param('idannonce') idannonce: string, @Param('idassemblee') idassemblee: string) {
    return this.service.remove(+idannonce, +idassemblee);
  }
}
