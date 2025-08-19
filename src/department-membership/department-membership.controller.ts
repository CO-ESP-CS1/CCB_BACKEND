import {
  Controller,
  Get,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { DepartmentMembershipService } from './department-membership.service';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { UserPayload } from '../auth/user-payload.decorator';

@ApiTags('Department Membership')
@ApiBearerAuth()
@Controller('departments/membership')
@UseGuards(AuthGuard)
export class DepartmentMembershipController {
  constructor(private readonly service: DepartmentMembershipService) {}

  @Get('check')
  @ApiOperation({
    summary: 'Vérifier si le membre connecté appartient à un département',
    description: 'Vérifie si le membre authentifié fait partie d\'un département spécifique, identifié par son ID ou son nom'
  })
  @ApiQuery({
    name: 'departmentId',
    type: Number,
    description: 'ID du département',
    required: false,
    example: 123
  })
  @ApiQuery({
    name: 'departmentName',
    type: String,
    description: 'Nom du département',
    required: false,
    example: 'Informatique'
  })
  @ApiResponse({
    status: 200,
    description: 'Résultat de la vérification',
    schema: {
      example: {
        isMember: true,
        message: 'Vous appartenez à ce département'
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Paramètres manquants'
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié'
  })
  async checkMembership(
    @UserPayload('idmembre') memberId: number,
    @Query('departmentId') departmentId?: string,
    @Query('departmentName') departmentName?: string
  ) {
    if (!departmentId && !departmentName) {
      throw new BadRequestException('Department ID or name must be provided');
    }

    const id = departmentId ? parseInt(departmentId, 10) : undefined;
    const isMember = await this.service.isMemberInDepartment(memberId, {
      id,
      name: departmentName
    });

    return {
      isMember,
      message: isMember 
        ? 'Vous appartenez à ce département' 
        : 'Vous n\'appartenez pas à ce département'
    };
  }
}