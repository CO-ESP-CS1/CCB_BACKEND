import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { UserPayload } from '../auth/user-payload.decorator';
import { AssemblyLocalService } from './assembly-local.service';
import { CreateEvangelizationSoulDto } from './dto/create-evangelization-soul.dto';
import { CreateDepartmentHelperDto } from './dto/create-department-helper.dto';
import { SaveAttendanceDto } from './dto/save-attendance.dto';
import { CreateFinanceDto } from './dto/create-finance.dto';
import { UpdateFinanceDto } from './dto/update-finance.dto';
import { CreateFinancePostDto } from './dto/create-finance-post.dto';
import { UpdateFinancePostDto } from './dto/update-finance-post.dto';
import { CreateFormationDto } from './dto/create-formation.dto';

@ApiTags('Assembly Local')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('assembly-local')
export class AssemblyLocalController {
  constructor(private readonly service: AssemblyLocalService) {}

  @Get('evangelization/souls')
  @ApiOperation({ summary: 'Lister les nouvelles âmes (évangélisation) de mon assemblée' })
  listSouls(
    @UserPayload('idmembre') memberId: number,
    @UserPayload('idassemblee') idassemblee: number,
  ) {
    return this.service.listSouls(memberId, idassemblee);
  }

  @Post('evangelization/souls')
  @ApiOperation({ summary: 'Ajouter une nouvelle âme' })
  addSoul(
    @UserPayload('idmembre') memberId: number,
    @UserPayload('idassemblee') idassemblee: number,
    @Body() dto: CreateEvangelizationSoulDto,
  ) {
    return this.service.addSoul(memberId, idassemblee, dto);
  }

  @Delete('evangelization/souls/:id')
  @ApiOperation({ summary: 'Supprimer une nouvelle âme' })
  deleteSoul(
    @UserPayload('idmembre') memberId: number,
    @UserPayload('idassemblee') idassemblee: number,
    @Param('id') soulId: string,
  ) {
    return this.service.deleteSoul(memberId, idassemblee, soulId);
  }

  @Get('department-helpers')
  @ApiOperation({ summary: 'Lister les serviteurs sans application' })
  listHelpers(
    @UserPayload('idmembre') memberId: number,
    @UserPayload('idassemblee') idassemblee: number,
  ) {
    return this.service.listDepartmentHelpers(memberId, idassemblee);
  }

  @Post('department-helpers')
  @ApiOperation({ summary: 'Ajouter un serviteur sans application' })
  addHelper(
    @UserPayload('idmembre') memberId: number,
    @UserPayload('idassemblee') idassemblee: number,
    @Body() dto: CreateDepartmentHelperDto,
  ) {
    return this.service.addDepartmentHelper(memberId, idassemblee, dto);
  }

  @Delete('department-helpers/:id')
  @ApiOperation({ summary: 'Supprimer un serviteur sans application' })
  deleteHelper(
    @UserPayload('idmembre') memberId: number,
    @UserPayload('idassemblee') idassemblee: number,
    @Param('id') helperId: string,
  ) {
    return this.service.deleteDepartmentHelper(memberId, idassemblee, helperId);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Résumé local assemblée (évangélisation, serviteurs, présences)' })
  getSummary(
    @UserPayload('idmembre') memberId: number,
    @UserPayload('idassemblee') idassemblee: number,
  ) {
    return this.service.getSummary(memberId, idassemblee);
  }

  @Get('attendance')
  @ApiOperation({ summary: 'Présences pour une date' })
  getAttendance(
    @UserPayload('idmembre') memberId: number,
    @UserPayload('idassemblee') idassemblee: number,
    @Query('date') date: string,
  ) {
    return this.service.getAttendance(memberId, idassemblee, date);
  }

  @Put('attendance')
  @ApiOperation({ summary: 'Enregistrer les présences du jour' })
  saveAttendance(
    @UserPayload('idmembre') memberId: number,
    @UserPayload('idassemblee') idassemblee: number,
    @Body() dto: SaveAttendanceDto,
  ) {
    return this.service.saveAttendance(memberId, idassemblee, dto);
  }

  @Post('finance-posts')
  @ApiOperation({ summary: 'Créer un grand poste financier' })
  addFinancePost(
    @UserPayload('idmembre') memberId: number,
    @UserPayload('idassemblee') idassemblee: number,
    @Body() dto: CreateFinancePostDto,
  ) {
    return this.service.addFinancePost(memberId, idassemblee, dto);
  }

  @Put('finance-posts/:id')
  @ApiOperation({ summary: 'Renommer un grand poste' })
  updateFinancePost(
    @UserPayload('idmembre') memberId: number,
    @UserPayload('idassemblee') idassemblee: number,
    @Param('id') postId: string,
    @Body() dto: UpdateFinancePostDto,
  ) {
    return this.service.updateFinancePost(memberId, idassemblee, postId, dto);
  }

  @Delete('finance-posts/:id')
  @ApiOperation({ summary: 'Supprimer un grand poste vide' })
  deleteFinancePost(
    @UserPayload('idmembre') memberId: number,
    @UserPayload('idassemblee') idassemblee: number,
    @Param('id') postId: string,
  ) {
    return this.service.deleteFinancePost(memberId, idassemblee, postId);
  }

  @Get('finances')
  @ApiOperation({ summary: 'Finances du jour par grands postes' })
  listFinances(
    @UserPayload('idmembre') memberId: number,
    @UserPayload('idassemblee') idassemblee: number,
    @Query('date') date: string,
  ) {
    return this.service.listFinances(memberId, idassemblee, date);
  }

  @Post('finances')
  @ApiOperation({ summary: 'Ajouter une entrée ou une dépense' })
  addFinance(
    @UserPayload('idmembre') memberId: number,
    @UserPayload('idassemblee') idassemblee: number,
    @Body() dto: CreateFinanceDto,
  ) {
    return this.service.addFinance(memberId, idassemblee, dto);
  }

  @Put('finances/:id')
  @ApiOperation({ summary: 'Modifier libellé ou montant' })
  updateFinance(
    @UserPayload('idmembre') memberId: number,
    @UserPayload('idassemblee') idassemblee: number,
    @Param('id') entryId: string,
    @Body() dto: UpdateFinanceDto,
  ) {
    return this.service.updateFinance(memberId, idassemblee, entryId, dto);
  }

  @Delete('finances/:id')
  @ApiOperation({ summary: 'Supprimer une entrée ou une dépense' })
  deleteFinance(
    @UserPayload('idmembre') memberId: number,
    @UserPayload('idassemblee') idassemblee: number,
    @Param('id') entryId: string,
  ) {
    return this.service.deleteFinance(memberId, idassemblee, entryId);
  }

  @Get('formations')
  @ApiOperation({ summary: 'Lister les formations de mon assemblée' })
  listFormations(
    @UserPayload('idmembre') memberId: number,
    @UserPayload('idassemblee') idassemblee: number,
  ) {
    return this.service.listFormations(memberId, idassemblee);
  }

  @Get('formations/:id')
  @ApiOperation({ summary: 'Détail d\'une formation' })
  getFormation(
    @UserPayload('idmembre') memberId: number,
    @UserPayload('idassemblee') idassemblee: number,
    @Param('id') formationId: string,
  ) {
    return this.service.getFormation(memberId, idassemblee, formationId);
  }

  @Post('formations')
  @ApiOperation({ summary: 'Publier une formation (PDF + titre + description)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['titre', 'description', 'pdf'],
      properties: {
        titre: { type: 'string' },
        description: { type: 'string' },
        pdf: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('pdf', {
      storage: memoryStorage(),
      limits: { fileSize: 20 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        const mime = (file.mimetype || '').toLowerCase();
        const name = (file.originalname || '').toLowerCase();
        if (mime === 'application/pdf' || name.endsWith('.pdf')) {
          cb(null, true);
        } else {
          cb(new Error('Seuls les fichiers PDF sont acceptés'), false);
        }
      },
    }),
  )
  @UsePipes(new ValidationPipe({ transform: true }))
  createFormation(
    @UserPayload('idmembre') memberId: number,
    @UserPayload('idassemblee') idassemblee: number,
    @Body() dto: CreateFormationDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.createFormation(
      memberId,
      idassemblee,
      dto.titre,
      dto.description,
      file,
    );
  }

  @Delete('formations/:id')
  @ApiOperation({ summary: 'Supprimer une formation' })
  deleteFormation(
    @UserPayload('idmembre') memberId: number,
    @UserPayload('idassemblee') idassemblee: number,
    @Param('id') formationId: string,
  ) {
    return this.service.deleteFormation(memberId, idassemblee, formationId);
  }
}
