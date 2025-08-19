// src/typeannonce/dto/update-typeannonce.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateTypeannonceDto } from './create-typeannonce.dto';

export class UpdateTypeannonceDto extends PartialType(CreateTypeannonceDto) {}
