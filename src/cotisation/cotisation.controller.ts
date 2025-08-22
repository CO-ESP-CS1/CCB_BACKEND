import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CotisationService } from './cotisation.service';
import { CreateCotisationDto } from './dto/create-cotisation.dto';
import { UpdateCotisationDto } from './dto/update-cotisation.dto';

@Controller('cotisations')
export class CotisationController {
  constructor(private readonly cotisationService: CotisationService) {}

  @Post()
  create(@Body() createCotisationDto: CreateCotisationDto) {
    return this.cotisationService.create(createCotisationDto);
  }



  @Get('assemblee/:idassemblee')
findByAssemblee(
  @Param('idassemblee') idassemblee: string,
  @Query('page') page?: string,
  @Query('limit') limit?: string,
) {
  const pageNumber = page ? parseInt(page, 10) : 1;
  const limitNumber = limit ? parseInt(limit, 10) : 10;
  return this.cotisationService.findByAssembleePaginated(
    +idassemblee,
    pageNumber,
    limitNumber,
  );
}

  @Get()
  findAll() {
    return this.cotisationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cotisationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCotisationDto: UpdateCotisationDto) {
    return this.cotisationService.update(+id, updateCotisationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cotisationService.remove(+id);
  }
}