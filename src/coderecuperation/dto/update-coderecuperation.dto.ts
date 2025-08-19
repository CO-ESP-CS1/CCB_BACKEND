import { PartialType } from '@nestjs/mapped-types';
import { CreateCodeRecuperationDto } from './create-coderecuperation.dto';

export class UpdateCodeRecuperationDto extends PartialType(CreateCodeRecuperationDto) {}
