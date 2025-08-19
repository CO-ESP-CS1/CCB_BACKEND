import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PersonneService } from './personne.service';
import { CreatePersonneDto } from './dto/create-personne.dto';
import { UpdatePersonneDto } from './dto/update-personne.dto';

@Controller('personnes')
export class PersonneController {
  constructor(private readonly personneService: PersonneService) {}

  @Post()
  create(@Body() dto: CreatePersonneDto) {
    return this.personneService.create(dto);
  }

  @Get()
  findAll() {
    return this.personneService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.personneService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePersonneDto) {
    return this.personneService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.personneService.remove(+id);
  }
}