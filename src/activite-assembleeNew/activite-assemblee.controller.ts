import { Controller, Post, Body } from '@nestjs/common';
import { ActiviteAssembleeService } from './activite-assemblee.service';
import { CreateActiviteAssembleeDto } from './dto/create-activite-assemblee.dto';
import { ApiTags, ApiBody , ApiOperation} from '@nestjs/swagger';

@ApiTags('Activités Assemblées')
@Controller('activite-assembleeNew')
export class ActiviteAssembleeController {
  constructor(private readonly activiteAssembleeService: ActiviteAssembleeService) {}
  @ApiOperation({ summary: 'Créer une occurence dans activite assemblee' })
  @Post()
  @ApiBody({
    description: 'Créer une relation entre une activité et plusieurs assemblées',
    type: CreateActiviteAssembleeDto,
    schema: {
      type: 'object',
      properties: {
        idactivite: { type: 'integer', description: 'ID de l\'activité à lier' },
        idassemblees: { 
          type: 'array',
          items: { type: 'integer' },
          description: 'Liste des IDs des assemblées auxquelles l\'activité doit être liée',
        },
      },
      required: ['idactivite', 'idassemblees'],
    },
  })
  async create(@Body() createActiviteAssembleeDto: CreateActiviteAssembleeDto) {
    return this.activiteAssembleeService.createActiviteAssemblees(createActiviteAssembleeDto);
  }
}
