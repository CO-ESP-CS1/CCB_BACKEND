// src/profilpersonne/dto/update-profilpersonne.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateProfilPersonneDto } from './create-profilpersonne.dto';

export class UpdateProfilPersonneDto extends PartialType(CreateProfilPersonneDto) {}