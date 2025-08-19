import { PartialType } from '@nestjs/swagger';
import { CreateDirigeDto } from './create-dirige.dto';

export class UpdateDirigeDto extends PartialType(CreateDirigeDto) {}
