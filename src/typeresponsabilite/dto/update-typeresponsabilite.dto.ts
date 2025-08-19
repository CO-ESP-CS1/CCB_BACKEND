// src/typeresponsabilite/dto/update-typeresponsabilite.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateTyperesponsabiliteDto } from './create-typeresponsabilite.dto';

export class UpdateTyperesponsabiliteDto extends PartialType(CreateTyperesponsabiliteDto) {}