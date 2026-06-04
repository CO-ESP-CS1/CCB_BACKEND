import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserPortalService } from './user-portal.service';

@ApiTags('Portail assemblée')
@ApiBearerAuth()
@Controller('assemblees')
export class PortalAssembleeController {
  constructor(private readonly service: UserPortalService) {}

  @Get(':id/departements')
  @ApiOperation({ summary: 'Départements d\'une assemblée (lecture seule)' })
  getDepartements(@Param('id', ParseIntPipe) id: number) {
    return this.service.getAssembleeDepartements(id);
  }

  @Get(':id/calendrier')
  @ApiOperation({ summary: 'Calendrier des séances d\'une assemblée' })
  getCalendrier(
    @Param('id', ParseIntPipe) id: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('scope', new DefaultValuePipe('upcoming')) scope: 'upcoming' | 'past' | 'all',
  ) {
    return this.service.getAssembleeCalendrier(id, page, limit, scope);
  }
}
