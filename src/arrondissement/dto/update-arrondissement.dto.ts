import { PartialType } from '@nestjs/mapped-types';
import { CreateArrondissementDto } from './create-arrondissement.dto';

export class UpdateArrondissementDto extends PartialType(CreateArrondissementDto) {}
