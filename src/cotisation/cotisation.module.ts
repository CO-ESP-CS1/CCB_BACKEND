import { Module } from '@nestjs/common';
import { CotisationService } from './cotisation.service';
import { CotisationController } from './cotisation.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CotisationController],
  providers: [CotisationService],
})
export class CotisationModule {}