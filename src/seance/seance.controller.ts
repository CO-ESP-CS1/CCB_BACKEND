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
import { SeanceService } from './seance.service';
import { CreateSeanceDto } from './dto/create-seance.dto';
import { UpdateSeanceDto } from './dto/update-seance.dto';

@Controller('seance')
export class SeanceController {
  constructor(private readonly service: SeanceService) {}

  @Post()
  create(@Body() dto: CreateSeanceDto) {
    return this.service.create(dto);
  }

@Get()
findAll(
  @Query('page', ParseIntPipe) page: number = 1,
  @Query('limit', ParseIntPipe) limit: number = 10,
  @Query('date') dateFilter?: string,
  @Query('planningId') planningId?: string,
  @Query('idactivite') idactivite?: string,
  @Query('sortBy') sortBy?: 'idactivite' | 'idintervenant' | 'date'
) {
  const date = dateFilter ? new Date(dateFilter) : undefined;

  const planningIdNum = planningId ? parseInt(planningId, 10) : undefined;
  const idactiviteNum = idactivite ? parseInt(idactivite, 10) : undefined;

  return this.service.findAll(page, limit, date, planningIdNum, sortBy, idactiviteNum);
}


  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSeanceDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}