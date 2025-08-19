import {
  Controller,
  Post,
  Body,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Get,
  Query,
} from '@nestjs/common';
import { ShortPublicationService } from './short-publication.service';
import { CreateShortDto } from './dto/create-short.dto';
import { AuthGuard } from '../auth/auth.guard';
import { UserPayload } from '../auth/user-payload.decorator';
import { Public } from '../auth/public.decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('short-publications')
@ApiBearerAuth()
@Controller('short-publications')
@UseGuards(AuthGuard)
export class ShortPublicationController {
  constructor(private readonly shortService: ShortPublicationService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle short publication' })
  @ApiResponse({ status: 201, description: 'Short publication créée avec succès.' })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  @ApiResponse({ status: 401, description: 'Non autorisé.' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async createShort(
    @Body() createShortDto: CreateShortDto,
    @UserPayload('idmembre') idmembre: number,
  ) {
    createShortDto.idmembre = idmembre;
    return this.shortService.createShort(createShortDto);
  }

  @Public()
  @Get('shorts')
  @ApiOperation({ summary: 'Récupérer les short publications publiées avec pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Nombre max de résultats à retourner' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Nombre de résultats à ignorer (offset)' })
  @ApiResponse({ status: 200, description: 'Liste des shorts publications récupérées avec succès.' })
  async getPublishedShorts(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const offsetNum = offset ? parseInt(offset, 10) : 0;

    return this.shortService.getPublishedShortPublications(limitNum, offsetNum);
  }
}
