// src/publication-action/dto/update-publication-action.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreatePublicationActionDto } from './create-publication-action.dto';

export class UpdatePublicationActionDto extends PartialType(CreatePublicationActionDto) {}