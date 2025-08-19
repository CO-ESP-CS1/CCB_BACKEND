import { PartialType } from '@nestjs/swagger';
import { CreateActiviteAssembleeDto1 } from './create-activite-assemblee.dto';

export class UpdateActiviteAssembleeDto extends PartialType(CreateActiviteAssembleeDto1) {}
