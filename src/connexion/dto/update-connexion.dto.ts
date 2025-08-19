import { PartialType } from '@nestjs/mapped-types';
import { CreateConnexionDto } from './create-connexion.dto';

export class UpdateConnexionDto extends PartialType(CreateConnexionDto) {}
