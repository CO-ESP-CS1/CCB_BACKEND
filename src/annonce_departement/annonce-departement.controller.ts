import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { AnnonceDepartementService } from './annonce-departement.service';
import { CreateAnnonceDepartementDto } from './dto/create-annonce-departement.dto';

@Controller('annonce-departement')
export class AnnonceDepartementController {
  constructor(private readonly service: AnnonceDepartementService) {}

  @Post()
  create(@Body() data: CreateAnnonceDepartementDto) {
    return this.service.create(data);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':idannonce/:iddepartement')
  findOne(
    @Param('idannonce') idannonce: number,
    @Param('iddepartement') iddepartement: number,
  ) {
    return this.service.findOne(Number(idannonce), Number(iddepartement));
  }

  @Delete(':idannonce/:iddepartement')
  remove(
    @Param('idannonce') idannonce: number,
    @Param('iddepartement') iddepartement: number,
  ) {
    return this.service.remove(Number(idannonce), Number(iddepartement));
  }
}
