import { PartialType } from '@nestjs/swagger';
import { CreateEstDto } from './create-est.dto';

export class UpdateEstDto extends PartialType(CreateEstDto) {}
