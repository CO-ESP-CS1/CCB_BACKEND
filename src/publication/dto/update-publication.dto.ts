// src/publication/dto/update-publication.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreatePublicationDto } from './create-publication.dto';

export class UpdatePublicationDto extends PartialType(CreatePublicationDto) {}