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
  BadRequestException,
} from '@nestjs/common';
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Public } from '../auth/public.decorator';

@Controller('session')
export class SessionController {
  constructor(private readonly service: SessionService) {}


   @Public()
  @Get('check')
  async checkSession(
    @Query('deviceid') deviceid: string,
    @Query('telephone') telephone: string
  ) {
    if (!deviceid || !telephone) {
      throw new BadRequestException(
        'Les paramètres deviceid et telephone sont obligatoires'
      );
    }
    return this.service.checkSessionExists(deviceid, telephone);
  }

  @Post()
  create(@Body() dto: CreateSessionDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSessionDto
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}