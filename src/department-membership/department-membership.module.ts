import { Module } from '@nestjs/common';
import { DepartmentMembershipService } from './department-membership.service';
import { DepartmentMembershipController } from './department-membership.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DepartmentMembershipController],
  providers: [DepartmentMembershipService],
})
export class DepartmentMembershipModule {}