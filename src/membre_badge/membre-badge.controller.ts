import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MembreBadgeService } from './membre-badge.service';
import { CreateMembreBadgeDto } from './dto/create-membre-badge.dto';
import { UpdateMembreBadgeDto } from './dto/update-membre-badge.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('membre-badge')
@Controller('membre-badge')
export class MembreBadgeController {
  constructor(private readonly service: MembreBadgeService) {}

  @Post()
  create(@Body() dto: CreateMembreBadgeDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':idmembre/:idbadge')
  findOne(@Param('idmembre') idmembre: string, @Param('idbadge') idbadge: string) {
    return this.service.findOne(+idmembre, +idbadge);
  }

  @Patch(':idmembre/:idbadge')
  update(
    @Param('idmembre') idmembre: string,
    @Param('idbadge') idbadge: string,
    @Body() dto: UpdateMembreBadgeDto,
  ) {
    return this.service.update(+idmembre, +idbadge, dto);
  }

  @Delete(':idmembre/:idbadge')
  remove(@Param('idmembre') idmembre: string, @Param('idbadge') idbadge: string) {
    return this.service.remove(+idmembre, +idbadge);
  }
}
