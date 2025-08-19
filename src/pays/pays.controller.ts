import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaysService } from './pays.service';
import { CreatePaysDto } from './dto/create-pays.dto';
import { UpdatePaysDto } from './dto/update-pays.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('pays')
@Controller('pays')
export class PaysController {
  constructor(private readonly paysService: PaysService) {}

  @Post()
  create(@Body() dto: CreatePaysDto) {
    return this.paysService.create(dto);
  }

  @Get()
  findAll() {
    return this.paysService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paysService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePaysDto) {
    return this.paysService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paysService.remove(+id);
  }
}
