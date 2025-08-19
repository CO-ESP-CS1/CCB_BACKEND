// src/typeactivites/dto/update-typeactivites.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateTypeactivitesDto } from './create-typeactivites.dto';

export class UpdateTypeactivitesDto extends PartialType(CreateTypeactivitesDto) {}