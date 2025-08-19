import { PartialType } from '@nestjs/swagger';
import { CreateLoginHistoryDto } from './create-loginhistory.dto';

export class UpdateLoginHistoryDto extends PartialType(CreateLoginHistoryDto) {}
