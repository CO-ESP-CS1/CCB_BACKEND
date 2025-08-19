// src/profilassemblee/dto/update-profilassemblee.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateProfilassembleeDto } from './create-profilassemblee.dto';

export class UpdateProfilassembleeDto extends PartialType(CreateProfilassembleeDto) {}