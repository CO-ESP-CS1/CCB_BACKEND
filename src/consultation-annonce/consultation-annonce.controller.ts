import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { ConsultationAnnonceService } from './consultation-annonce.service';
import { CreateConsultationAnnonceDto } from './dto/create-consultation-annonce.dto';
import { ConsultationAnnonceDto } from './dto/consultation-annonce.dto';

@Controller('consultation-annoncen')
export class ConsultationAnnonceController {
  constructor(
    private readonly consultationService: ConsultationAnnonceService,
  ) {}

  @Post()
  create(
    @Body() createDto: CreateConsultationAnnonceDto,
  ): Promise<ConsultationAnnonceDto> {
    return this.consultationService.create(createDto);
  }

  @Get('membre/:id')
  findByMembre(@Param('id') id: string) {
    return this.consultationService.findByMembre(parseInt(id));
  }

  @Get('annonce/:id')
  findByAnnonce(@Param('id') id: string) {
    return this.consultationService.findByAnnonce(parseInt(id));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.consultationService.findOne(parseInt(id));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.consultationService.remove(parseInt(id));
  }
}