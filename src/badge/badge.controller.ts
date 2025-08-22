import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BadgeService } from './badge.service';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';

@Controller('badge')
export class BadgeController {
  constructor(private readonly service: BadgeService) {}

  @Post()
  create(@Body() data: CreateBadgeDto) {
    return this.service.create(data);
  }

 // badge.controller.ts
@Get()
findAll(
  @Query('page') page: string = '1',
  @Query('limit') limit: string = '10',
) {
  return this.service.findAll(Number(page), Number(limit));
}


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateBadgeDto) {
    return this.service.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
