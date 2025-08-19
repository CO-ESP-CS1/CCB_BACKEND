import { PartialType } from '@nestjs/swagger';
import { CreateParticipeDto } from './create-participe.dto';

export class UpdateParticipeDto extends PartialType(CreateParticipeDto) {}
