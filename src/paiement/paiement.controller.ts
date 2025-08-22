import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PaiementService } from './paiement.service';
import { CreatePaiementDto } from './dto/create-paiement.dto';
import { UpdatePaiementDto } from './dto/update-paiement.dto';

@Controller('paiements')
export class PaiementController {
  constructor(private readonly paiementService: PaiementService) {}

  @Post()
  create(@Body() createPaiementDto: CreatePaiementDto) {
    return this.paiementService.create(createPaiementDto);
  }

@Get()
findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
  return this.paiementService.findAll(Number(page) || 1, Number(limit) || 10);
}

 
@Get('membre/:idmembre')
findByMembre(
  @Param('idmembre') idmembre: string,
  @Query('page') page?: string,
  @Query('limit') limit?: string
) {
  return this.paiementService.findByMembre(+idmembre, Number(page) || 1, Number(limit) || 10);
}

@Get('cotisation/:idcotisation')
findByCotisation(
  @Param('idcotisation') idcotisation: string,
  @Query('page') page?: string,
  @Query('limit') limit?: string,
  @Query('statut') statut?: string, // nouveau paramètre
) {
  return this.paiementService.findByCotisation(
    +idcotisation,
    Number(page) || 1,
    Number(limit) || 10,
    statut,
  );
}


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paiementService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaiementDto: UpdatePaiementDto) {
    return this.paiementService.update(+id, updatePaiementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paiementService.remove(+id);
  }
}