import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { ArrondissementService } from './arrondissement.service';
import { CreateArrondissementDto } from './dto/create-arrondissement.dto';
import { UpdateArrondissementDto } from './dto/update-arrondissement.dto';

@Controller('arrondissements')
export class ArrondissementController {
  constructor(private readonly service: ArrondissementService) {}

  @Post()
  create(@Body() data: CreateArrondissementDto) {
    return this.service.create(data);
  }

  @Get()
  findAll(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const parsedLimit = limit ? parseInt(limit, 10) : 10;
    const parsedOffset = offset ? parseInt(offset, 10) : 0;

    return this.service.findAll(parsedLimit, parsedOffset);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() data: UpdateArrondissementDto) {
    return this.service.update(Number(id), data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(Number(id));
  }
}
