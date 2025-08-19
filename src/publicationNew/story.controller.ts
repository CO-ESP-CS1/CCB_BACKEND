import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { StoryService } from './story.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { AuthGuard } from '../auth/auth.guard';
import { UserPayload } from '../auth/user-payload.decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('stories')
@ApiBearerAuth()
@Controller('stories')
@UseGuards(AuthGuard)
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle story avec un fichier média' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Données de la story avec fichier média',
    schema: {
      type: 'object',
      properties: {
        mediaurl: {
          type: 'string',
          format: 'binary',
          description: 'Fichier média de la story (image ou vidéo)',
        },
        // Ici, tu peux ajouter les propriétés de CreateStoryDto (ex: titre, description) pour Swagger
      },
      required: ['mediaurl'], // si c'est obligatoire
    },
  })
  @ApiResponse({ status: 201, description: 'Story créée avec succès.' })
  @ApiResponse({ status: 400, description: 'Données invalides ou fichier manquant.' })
  @ApiResponse({ status: 401, description: 'Non autorisé.' })
  @UseInterceptors(
    FileInterceptor('mediaurl', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 }, // limite taille 5MB
    }),
  )
  @UsePipes(new ValidationPipe({ transform: true }))
  async createStory(
    @Body() createStoryDto: CreateStoryDto,
    @UploadedFile() file: Express.Multer.File,
    @UserPayload('idmembre') idmembre: number,
  ) {
    createStoryDto.idmembre = idmembre;
    return this.storyService.createStory(createStoryDto, file);
  }
}
