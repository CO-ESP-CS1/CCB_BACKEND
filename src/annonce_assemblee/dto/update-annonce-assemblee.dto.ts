import { PartialType } from '@nestjs/swagger';
import { CreateAnnonceAssembleeDto } from './create-annonce-assemblee.dto';

export class UpdateAnnonceAssembleeDto extends PartialType(CreateAnnonceAssembleeDto) {}
