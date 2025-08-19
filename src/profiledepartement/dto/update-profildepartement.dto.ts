// src/profildepartement/dto/update-profildepartement.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateProfilDepartementDto } from './create-profildepartement.dto';

export class UpdateProfilDepartementDto extends PartialType(CreateProfilDepartementDto) {}