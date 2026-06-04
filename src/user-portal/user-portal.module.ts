import { Module } from '@nestjs/common';
import { UserPortalService } from './user-portal.service';
import { MeController } from './me.controller';
import { PortalAssembleeController } from './portal-assemblee.controller';
import { PortalDepartementController } from './portal-departement.controller';
import { ReferentielsController } from './referentiels.controller';
import { DashboardModule } from '../dashboard/dashboard.module';

@Module({
  imports: [DashboardModule],
  controllers: [
    MeController,
    PortalAssembleeController,
    PortalDepartementController,
    ReferentielsController,
  ],
  providers: [UserPortalService],
})
export class UserPortalModule {}
