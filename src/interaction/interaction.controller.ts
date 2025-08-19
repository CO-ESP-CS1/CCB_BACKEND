import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InteractionService } from './interaction.service';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { UpdateInteractionDto } from './dto/update-interaction.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InteractionResponseDto } from './dto/interaction-response.dto';

@ApiTags('interactions')
@Controller('interactions')
export class InteractionController {
  constructor(private readonly interactionService: InteractionService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une interaction' })
  @ApiResponse({ status: 201, type: InteractionResponseDto })
  create(@Body() dto: CreateInteractionDto) {
    return this.interactionService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister toutes les interactions' })
  @ApiResponse({ status: 200, type: [InteractionResponseDto] })
  findAll() {
    return this.interactionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une interaction par ID' })
  @ApiResponse({ status: 200, type: InteractionResponseDto })
  findOne(@Param('id') id: string) {
    return this.interactionService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une interaction' })
  @ApiResponse({ status: 200, type: InteractionResponseDto })
  update(@Param('id') id: string, @Body() dto: UpdateInteractionDto) {
    return this.interactionService.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une interaction' })
  @ApiResponse({ status: 204 })
  remove(@Param('id') id: string) {
    return this.interactionService.remove(+id);
  }
}
