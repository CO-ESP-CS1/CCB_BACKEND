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

@ApiTags('Portail département')
@ApiBearerAuth()
@Controller('departement')
export class PortalDepartementController {
  constructor(private readonly service: UserPortalService) {}

  @Get(':id/membres')
  @ApiOperation({ summary: 'Membres d\'un département (lecture seule)' })
  getMembres(
    @Param('id', ParseIntPipe) id: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.service.getDepartementMembres(id, page, limit);
  }
}
