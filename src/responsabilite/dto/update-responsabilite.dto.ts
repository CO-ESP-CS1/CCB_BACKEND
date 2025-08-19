// src/responsabilite/dto/update-responsabilite.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateResponsabiliteDto } from './create-responsabilite.dto';

export class UpdateResponsabiliteDto extends PartialType(CreateResponsabiliteDto) {}