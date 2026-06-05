import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as fs from 'fs/promises';
import * as path from 'path';
import { randomUUID } from 'crypto';
import {
  AssemblyLocalFile,
  EMPTY_ASSEMBLY_LOCAL,
  EvangelizationSoul,
  DepartmentHelper,
  AttendanceRecord,
  FinanceEntry,
  FinancePost,
  FormationItem,
} from './assembly-local.types';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateEvangelizationSoulDto } from './dto/create-evangelization-soul.dto';
import { CreateDepartmentHelperDto } from './dto/create-department-helper.dto';
import { SaveAttendanceDto } from './dto/save-attendance.dto';
import { CreateFinanceDto } from './dto/create-finance.dto';
import { UpdateFinanceDto } from './dto/update-finance.dto';
import { CreateFinancePostDto } from './dto/create-finance-post.dto';
import { UpdateFinancePostDto } from './dto/update-finance-post.dto';

const MANAGER_BADGES = [
  'assembleeManager',
  'gestionnaire',
  'adminBadge',
  'ManagerApp',
];

@Injectable()
export class AssemblyLocalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private getFilePath(idassemblee: number): string {
    const base =
      process.env.ASSEMBLY_LOCAL_JSON_DIR ||
      path.join(process.cwd(), 'data', 'assembly-local');
    return path.join(base, `${idassemblee}.json`);
  }

  private async readFile(idassemblee: number): Promise<AssemblyLocalFile> {
    const filePath = this.getFilePath(idassemblee);
    try {
      const raw = await fs.readFile(filePath, 'utf-8');
      const parsed = JSON.parse(raw) as Partial<AssemblyLocalFile>;
      return {
        ...EMPTY_ASSEMBLY_LOCAL,
        ...parsed,
        evangelizationSouls: parsed.evangelizationSouls ?? [],
        departmentHelpers: parsed.departmentHelpers ?? [],
        attendanceRecords: parsed.attendanceRecords ?? [],
        financePosts: parsed.financePosts ?? [],
        financeEntries: (parsed.financeEntries ?? []).map((e) => ({
          ...e,
          postId: e.postId ?? null,
        })),
        formations: parsed.formations ?? [],
      };
    } catch {
      return { ...EMPTY_ASSEMBLY_LOCAL };
    }
  }

  private async writeFile(idassemblee: number, data: AssemblyLocalFile): Promise<void> {
    const filePath = this.getFilePath(idassemblee);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    const payload: AssemblyLocalFile = {
      ...data,
      updatedAt: new Date().toISOString(),
    };
    await fs.writeFile(filePath, JSON.stringify(payload, null, 2), 'utf-8');
  }

  async assertCanManageAssembly(
    memberId: number,
    idassemblee?: number | null,
  ): Promise<number> {
    if (!idassemblee) {
      throw new ForbiddenException(
        'Votre compte n\'est associé à aucune assemblée.',
      );
    }

    for (const badgeName of MANAGER_BADGES) {
      const badge = await this.prisma.badge.findFirst({
        where: { nombadge: badgeName },
      });
      if (!badge) continue;
      const link = await this.prisma.membre_badge.findUnique({
        where: {
          idmembre_idbadge: { idmembre: memberId, idbadge: badge.idbadge },
        },
      });
      if (link) return idassemblee;
    }

    throw new ForbiddenException(
      'Accès réservé aux gestionnaires de l\'assemblée.',
    );
  }

  assertAssemblyMember(idassemblee?: number | null): number {
    if (!idassemblee) {
      throw new ForbiddenException(
        'Votre compte n\'est associé à aucune assemblée.',
      );
    }
    return idassemblee;
  }

  async listSouls(memberId: number, idassemblee?: number | null) {
    const assemblyId = await this.assertCanManageAssembly(memberId, idassemblee);
    const data = await this.readFile(assemblyId);
    return {
      count: data.evangelizationSouls.length,
      souls: data.evangelizationSouls,
    };
  }

  async addSoul(
    memberId: number,
    idassemblee: number | null | undefined,
    dto: CreateEvangelizationSoulDto,
  ) {
    const assemblyId = await this.assertCanManageAssembly(memberId, idassemblee);
    const data = await this.readFile(assemblyId);
    const soul: EvangelizationSoul = {
      id: randomUUID(),
      prenom: dto.prenom.trim(),
      nom: dto.nom.trim(),
      age: dto.age,
      baptise: dto.baptise,
      invitePar: dto.invitePar.trim(),
      createdAt: new Date().toISOString(),
    };
    data.evangelizationSouls.unshift(soul);
    await this.writeFile(assemblyId, data);
    return soul;
  }

  async deleteSoul(
    memberId: number,
    idassemblee: number | null | undefined,
    soulId: string,
  ) {
    const assemblyId = await this.assertCanManageAssembly(memberId, idassemblee);
    const data = await this.readFile(assemblyId);
    const before = data.evangelizationSouls.length;
    data.evangelizationSouls = data.evangelizationSouls.filter((s) => s.id !== soulId);
    if (data.evangelizationSouls.length === before) {
      throw new NotFoundException('Personne introuvable.');
    }
    data.attendanceRecords = data.attendanceRecords.map((r) => ({
      ...r,
      soulIds: (r.soulIds ?? []).filter((id) => id !== soulId),
    }));
    await this.writeFile(assemblyId, data);
    return { success: true };
  }

  async listDepartmentHelpers(memberId: number, idassemblee?: number | null) {
    const assemblyId = await this.assertCanManageAssembly(memberId, idassemblee);
    const data = await this.readFile(assemblyId);
    return {
      count: data.departmentHelpers.length,
      helpers: data.departmentHelpers,
    };
  }

  async addDepartmentHelper(
    memberId: number,
    idassemblee: number | null | undefined,
    dto: CreateDepartmentHelperDto,
  ) {
    const assemblyId = await this.assertCanManageAssembly(memberId, idassemblee);
    const data = await this.readFile(assemblyId);
    const helper: DepartmentHelper = {
      id: randomUUID(),
      prenom: dto.prenom.trim(),
      nom: dto.nom.trim(),
      age: dto.age,
      departementLibelle: dto.departementLibelle.trim(),
      createdAt: new Date().toISOString(),
    };
    data.departmentHelpers.unshift(helper);
    await this.writeFile(assemblyId, data);
    return helper;
  }

  async deleteDepartmentHelper(
    memberId: number,
    idassemblee: number | null | undefined,
    helperId: string,
  ) {
    const assemblyId = await this.assertCanManageAssembly(memberId, idassemblee);
    const data = await this.readFile(assemblyId);
    const before = data.departmentHelpers.length;
    data.departmentHelpers = data.departmentHelpers.filter((h) => h.id !== helperId);
    if (data.departmentHelpers.length === before) {
      throw new NotFoundException('Personne introuvable.');
    }
    data.attendanceRecords = data.attendanceRecords.map((r) => ({
      ...r,
      helperIds: (r.helperIds ?? []).filter((id) => id !== helperId),
    }));
    await this.writeFile(assemblyId, data);
    return { success: true };
  }

  async getSummary(memberId: number, idassemblee?: number | null) {
    const assemblyId = await this.assertCanManageAssembly(memberId, idassemblee);
    const data = await this.readFile(assemblyId);
    const records = [...data.attendanceRecords]
      .map((r) => ({
        ...r,
        membreIds: r.membreIds ?? [],
        soulIds: r.soulIds ?? [],
        helperIds: r.helperIds ?? [],
      }))
      .sort((a, b) => b.date.localeCompare(a.date));
    return {
      evangelizationSouls: data.evangelizationSouls,
      departmentHelpers: data.departmentHelpers,
      attendanceRecords: records,
      financePosts: data.financePosts,
      financeEntries: data.financeEntries,
      formations: data.formations,
    };
  }

  private buildFinanceDayResponse(day: string, data: AssemblyLocalFile) {
    const dayPosts = data.financePosts
      .filter((p) => p.date === day)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const dayEntries = data.financeEntries.filter((e) => e.date === day);

    const posts = dayPosts.map((post) => {
      const linked = dayEntries.filter((e) => e.postId === post.id);
      const incomes = linked.filter((e) => e.type === 'income');
      const expenses = linked.filter((e) => e.type === 'expense');
      const totalIncome = incomes.reduce((s, e) => s + e.montant, 0);
      const totalExpense = expenses.reduce((s, e) => s + e.montant, 0);
      return {
        post,
        incomes,
        expenses,
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
      };
    });

    const unassignedEntries = dayEntries.filter((e) => !e.postId);
    const unassignedIncomes = unassignedEntries.filter((e) => e.type === 'income');
    const unassignedExpenses = unassignedEntries.filter((e) => e.type === 'expense');
    const unassignedIncome = unassignedIncomes.reduce((s, e) => s + e.montant, 0);
    const unassignedExpense = unassignedExpenses.reduce((s, e) => s + e.montant, 0);

    const totalIncome = dayEntries
      .filter((e) => e.type === 'income')
      .reduce((s, e) => s + e.montant, 0);
    const totalExpense = dayEntries
      .filter((e) => e.type === 'expense')
      .reduce((s, e) => s + e.montant, 0);

    return {
      date: day,
      posts,
      unassigned: {
        incomes: unassignedIncomes,
        expenses: unassignedExpenses,
        totalIncome: unassignedIncome,
        totalExpense: unassignedExpense,
        balance: unassignedIncome - unassignedExpense,
      },
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  }

  private findFinancePost(data: AssemblyLocalFile, postId: string, day?: string) {
    const post = data.financePosts.find((p) => p.id === postId);
    if (!post) {
      throw new NotFoundException('Grand poste introuvable.');
    }
    if (day && post.date !== day) {
      throw new BadRequestException(
        'Ce grand poste ne correspond pas à la date sélectionnée.',
      );
    }
    return post;
  }

  private assertValidDate(date: string): string {
    const normalized = date.slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
      throw new BadRequestException('Date invalide (format AAAA-MM-JJ).');
    }
    return normalized;
  }

  async listFinances(
    memberId: number,
    idassemblee: number | null | undefined,
    date: string,
  ) {
    const assemblyId = await this.assertCanManageAssembly(memberId, idassemblee);
    const day = this.assertValidDate(date);
    const data = await this.readFile(assemblyId);
    return this.buildFinanceDayResponse(day, data);
  }

  async addFinancePost(
    memberId: number,
    idassemblee: number | null | undefined,
    dto: CreateFinancePostDto,
  ) {
    const assemblyId = await this.assertCanManageAssembly(memberId, idassemblee);
    const day = this.assertValidDate(dto.date);
    const data = await this.readFile(assemblyId);
    const now = new Date().toISOString();
    const post: FinancePost = {
      id: randomUUID(),
      libelle: dto.libelle.trim(),
      date: day,
      createdAt: now,
      updatedAt: now,
    };
    data.financePosts.unshift(post);
    await this.writeFile(assemblyId, data);
    return post;
  }

  async updateFinancePost(
    memberId: number,
    idassemblee: number | null | undefined,
    postId: string,
    dto: UpdateFinancePostDto,
  ) {
    const assemblyId = await this.assertCanManageAssembly(memberId, idassemblee);
    const data = await this.readFile(assemblyId);
    const idx = data.financePosts.findIndex((p) => p.id === postId);
    if (idx < 0) {
      throw new NotFoundException('Grand poste introuvable.');
    }
    data.financePosts[idx] = {
      ...data.financePosts[idx],
      libelle: dto.libelle.trim(),
      updatedAt: new Date().toISOString(),
    };
    await this.writeFile(assemblyId, data);
    return data.financePosts[idx];
  }

  async deleteFinancePost(
    memberId: number,
    idassemblee: number | null | undefined,
    postId: string,
  ) {
    const assemblyId = await this.assertCanManageAssembly(memberId, idassemblee);
    const data = await this.readFile(assemblyId);
    const hasEntries = data.financeEntries.some((e) => e.postId === postId);
    if (hasEntries) {
      throw new BadRequestException(
        'Supprimez ou déplacez les écritures avant de retirer ce grand poste.',
      );
    }
    const before = data.financePosts.length;
    data.financePosts = data.financePosts.filter((p) => p.id !== postId);
    if (data.financePosts.length === before) {
      throw new NotFoundException('Grand poste introuvable.');
    }
    await this.writeFile(assemblyId, data);
    return { success: true };
  }

  async addFinance(
    memberId: number,
    idassemblee: number | null | undefined,
    dto: CreateFinanceDto,
  ) {
    const assemblyId = await this.assertCanManageAssembly(memberId, idassemblee);
    const day = this.assertValidDate(dto.date);
    const data = await this.readFile(assemblyId);
    this.findFinancePost(data, dto.postId, day);
    const now = new Date().toISOString();
    const entry: FinanceEntry = {
      id: randomUUID(),
      type: dto.type,
      date: day,
      postId: dto.postId,
      libelle: dto.libelle.trim(),
      montant: Math.round(dto.montant * 100) / 100,
      createdAt: now,
      updatedAt: now,
    };
    data.financeEntries.unshift(entry);
    await this.writeFile(assemblyId, data);
    return entry;
  }

  async updateFinance(
    memberId: number,
    idassemblee: number | null | undefined,
    entryId: string,
    dto: UpdateFinanceDto,
  ) {
    const assemblyId = await this.assertCanManageAssembly(memberId, idassemblee);
    if (!dto.libelle && dto.montant == null && !dto.postId) {
      throw new BadRequestException('Renseignez au moins un champ à modifier.');
    }
    const data = await this.readFile(assemblyId);
    const idx = data.financeEntries.findIndex((e) => e.id === entryId);
    if (idx < 0) {
      throw new NotFoundException('Écriture introuvable.');
    }
    const current = data.financeEntries[idx];
    if (dto.postId) {
      this.findFinancePost(data, dto.postId, current.date);
    }
    data.financeEntries[idx] = {
      ...current,
      libelle: dto.libelle?.trim() ?? current.libelle,
      montant:
        dto.montant != null
          ? Math.round(dto.montant * 100) / 100
          : current.montant,
      postId: dto.postId ?? current.postId,
      updatedAt: new Date().toISOString(),
    };
    await this.writeFile(assemblyId, data);
    return data.financeEntries[idx];
  }

  async deleteFinance(
    memberId: number,
    idassemblee: number | null | undefined,
    entryId: string,
  ) {
    const assemblyId = await this.assertCanManageAssembly(memberId, idassemblee);
    const data = await this.readFile(assemblyId);
    const before = data.financeEntries.length;
    data.financeEntries = data.financeEntries.filter((e) => e.id !== entryId);
    if (data.financeEntries.length === before) {
      throw new NotFoundException('Écriture introuvable.');
    }
    await this.writeFile(assemblyId, data);
    return { success: true };
  }

  async getAttendance(
    memberId: number,
    idassemblee: number | null | undefined,
    date: string,
  ) {
    const assemblyId = await this.assertCanManageAssembly(memberId, idassemblee);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new BadRequestException('Date invalide (format AAAA-MM-JJ).');
    }
    const data = await this.readFile(assemblyId);
    const record = data.attendanceRecords.find((r) => r.date === date);
    return record
      ? {
          ...record,
          membreIds: record.membreIds ?? [],
          soulIds: record.soulIds ?? [],
          helperIds: record.helperIds ?? [],
        }
      : {
          date,
          membreIds: [],
          soulIds: [],
          helperIds: [],
          updatedAt: null,
        };
  }

  async saveAttendance(
    memberId: number,
    idassemblee: number | null | undefined,
    dto: SaveAttendanceDto,
  ) {
    const assemblyId = await this.assertCanManageAssembly(memberId, idassemblee);
    const date = dto.date.slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new BadRequestException('Date invalide (format AAAA-MM-JJ).');
    }

    const data = await this.readFile(assemblyId);
    const soulIdSet = new Set(data.evangelizationSouls.map((s) => s.id));
    const invalidSoul = dto.soulIds.find((id) => !soulIdSet.has(id));
    if (invalidSoul) {
      throw new BadRequestException(
        'Certaines personnes ne proviennent pas de l\'évangélisation.',
      );
    }

    const helperIdSet = new Set(data.departmentHelpers.map((h) => h.id));
    const invalidHelper = dto.helperIds.find((id) => !helperIdSet.has(id));
    if (invalidHelper) {
      throw new BadRequestException(
        'Certains serviteurs ne sont pas enregistrés dans l\'assemblée.',
      );
    }

    const record: AttendanceRecord = {
      date,
      membreIds: [...new Set(dto.membreIds)],
      soulIds: [...new Set(dto.soulIds)],
      helperIds: [...new Set(dto.helperIds)],
      updatedAt: new Date().toISOString(),
    };

    const idx = data.attendanceRecords.findIndex((r) => r.date === date);
    if (idx >= 0) {
      data.attendanceRecords[idx] = record;
    } else {
      data.attendanceRecords.push(record);
    }

    await this.writeFile(assemblyId, data);
    return record;
  }

  async listFormations(memberId: number, idassemblee?: number | null) {
    const assemblyId = this.assertAssemblyMember(idassemblee);
    const data = await this.readFile(assemblyId);
    const formations = [...data.formations].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
    return { count: formations.length, formations };
  }

  async getFormation(
    memberId: number,
    idassemblee: number | null | undefined,
    formationId: string,
  ) {
    const assemblyId = this.assertAssemblyMember(idassemblee);
    const data = await this.readFile(assemblyId);
    const formation = data.formations.find((f) => f.id === formationId);
    if (!formation) {
      throw new NotFoundException('Formation introuvable.');
    }
    return formation;
  }

  async createFormation(
    memberId: number,
    idassemblee: number | null | undefined,
    titre: string,
    description: string,
    file: Express.Multer.File,
  ) {
    const assemblyId = await this.assertCanManageAssembly(memberId, idassemblee);
    if (!titre?.trim()) {
      throw new BadRequestException('Le titre est requis.');
    }
    if (!description?.trim()) {
      throw new BadRequestException('La description est requise.');
    }
    if (!file?.buffer?.length) {
      throw new BadRequestException('Fichier PDF requis.');
    }
    const mime = (file.mimetype || '').toLowerCase();
    const name = (file.originalname || '').toLowerCase();
    if (mime !== 'application/pdf' && !name.endsWith('.pdf')) {
      throw new BadRequestException('Seuls les fichiers PDF sont acceptés.');
    }

    const uploaded = await this.cloudinaryService.uploadPdf(
      file.buffer,
      `assembly-formations/${assemblyId}`,
      file.originalname || 'formation.pdf',
    );

    const data = await this.readFile(assemblyId);
    const now = new Date().toISOString();
    const formation: FormationItem = {
      id: randomUUID(),
      titre: titre.trim(),
      description: description.trim(),
      pdfUrl: uploaded.secure_url,
      pdfViewUrl: uploaded.view_url,
      pdfPublicId: uploaded.public_id,
      originalFilename: file.originalname || 'formation.pdf',
      createdAt: now,
      updatedAt: now,
    };
    data.formations.unshift(formation);
    await this.writeFile(assemblyId, data);
    return formation;
  }

  async deleteFormation(
    memberId: number,
    idassemblee: number | null | undefined,
    formationId: string,
  ) {
    const assemblyId = await this.assertCanManageAssembly(memberId, idassemblee);
    const data = await this.readFile(assemblyId);
    const target = data.formations.find((f) => f.id === formationId);
    if (!target) {
      throw new NotFoundException('Formation introuvable.');
    }

    if (target.pdfPublicId) {
      try {
        await this.cloudinaryService.deleteRawAsset(target.pdfPublicId);
      } catch {
        // fichier Cloudinary déjà absent
      }
    }

    data.formations = data.formations.filter((f) => f.id !== formationId);
    await this.writeFile(assemblyId, data);
    return { success: true };
  }
}
