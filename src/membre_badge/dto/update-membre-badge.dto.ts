import { PartialType } from '@nestjs/swagger';
import { CreateMembreBadgeDto } from './create-membre-badge.dto';

export class UpdateMembreBadgeDto extends PartialType(CreateMembreBadgeDto) {}
