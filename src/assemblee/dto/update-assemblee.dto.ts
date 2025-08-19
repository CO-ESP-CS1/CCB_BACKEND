import { PartialType } from '@nestjs/mapped-types';
import { CreateAssembleeDto } from './create-assemblee.dto';

export class UpdateAssembleeDto extends PartialType(CreateAssembleeDto) {}
