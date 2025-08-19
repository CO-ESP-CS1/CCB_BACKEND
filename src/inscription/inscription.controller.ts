import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { InscriptionService } from './inscription.service';
import { CreateInscriptionDto } from './dto/create-inscription.dto';
import { UpdateInscriptionDto } from './dto/update-inscription.dto';
import { UpdateInscriptionStatusDto } from './dto/update-inscription-status.dto';

@Controller('inscriptions')
export class InscriptionController {
  constructor(private readonly service: InscriptionService) {}

  @Post()
  create(@Body() dto: CreateInscriptionDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('activite') idactivite?: number,
    @Query('membre') idmembre?: number,
    @Query('statut') statut?: string
  ) {
    return this.service.findAll(page, limit, idactivite, idmembre, statut);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateInscriptionDto
  ) {
    return this.service.update(id, dto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateInscriptionStatusDto
  ) {
    return this.service.updateStatus(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}