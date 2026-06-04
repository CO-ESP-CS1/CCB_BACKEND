import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserPortalService } from './user-portal.service';

@ApiTags('Référentiels')
@ApiBearerAuth()
@Controller('referentiels')
export class ReferentielsController {
  constructor(private readonly service: UserPortalService) {}

  @Get('types-activites')
  @ApiOperation({ summary: 'Types d\'activités (lecture seule)' })
  getTypesActivites() {
    return this.service.getTypesActivites();
  }

  @Get('types-annonces')
  @ApiOperation({ summary: 'Types d\'annonces (lecture seule)' })
  getTypesAnnonces() {
    return this.service.getTypesAnnonces();
  }

  @Get('badges')
  @ApiOperation({ summary: 'Catalogue des badges (lecture seule)' })
  getBadges(
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ) {
    return this.service.getBadgesReferentiel(limit, offset);
  }
}
