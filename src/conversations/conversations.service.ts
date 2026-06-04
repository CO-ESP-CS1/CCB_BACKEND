import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import {
  DM_DELIVERED_RESOURCE_TYPE,
  DM_DELETED_PREFIX,
  DM_IMAGE_PREFIX,
  DM_GROUP_RESOURCE_TYPE,
  DM_HIDE_RESOURCE_TYPE,
  DM_INTERACTION_TYPE,
  DM_MAX_CONTENT_LENGTH,
  DM_READ_RESOURCE_TYPE,
  DM_RECEIPT_TYPE,
  DM_RESSOURCE_TYPE,
} from './conversations.constants';
import {
  DM_GROUP_MAX_MEMBERS,
  DM_GROUPS_MAX,
  readDmGroupsFile,
  writeDmGroupsFile,
  type DmGroupDto,
} from './conversation-groups';
import {
  buildImageContenu,
  isImageContenu,
  parseImageContenu,
  threadPreviewFromContenu,
} from './conversations-image.util';

type MemberPerson = {
  idmembre: number;
  role: string;
  personne: {
    nom: string;
    prenom: string;
    telephone?: string | null;
    profilpersonne: { photourl: string | null }[];
  };
  est?: { departement: { nomdepartement: string | null } }[];
};

type MessageStatus = 'sent' | 'delivered' | 'read';

@Injectable()
export class ConversationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private memberInclude() {
    return {
      personne: {
        include: {
          profilpersonne: { select: { photourl: true }, take: 1 },
        },
      },
      est: {
        include: {
          departement: { select: { nomdepartement: true } },
        },
      },
    };
  }

  private formatMember(m: MemberPerson) {
    const departements =
      m.est
        ?.map((e) => e.departement?.nomdepartement)
        .filter((n): n is string => Boolean(n)) ?? [];
    return {
      idmembre: m.idmembre,
      nom: m.personne.nom,
      prenom: m.personne.prenom,
      fullName: `${m.personne.prenom} ${m.personne.nom}`.trim(),
      photo: m.personne.profilpersonne[0]?.photourl ?? null,
      telephone: m.personne.telephone ?? null,
      role: m.role,
      departements,
    };
  }

  private async getMyAssemblee(idmembre: number) {
    const me = await this.prisma.membre.findUnique({
      where: { idmembre },
      select: { idassemblee: true },
    });
    if (!me) throw new NotFoundException('Membre introuvable');
    return me.idassemblee;
  }

  private async assertSameAssemblee(myId: number, partnerId: number) {
    if (myId === partnerId) {
      throw new BadRequestException('Impossible de vous envoyer un message');
    }
    const [me, partner] = await Promise.all([
      this.prisma.membre.findUnique({
        where: { idmembre: myId },
        select: { idassemblee: true },
      }),
      this.prisma.membre.findUnique({
        where: { idmembre: partnerId },
        select: { idassemblee: true },
      }),
    ]);
    if (!me || !partner) throw new NotFoundException('Membre introuvable');
    if (partner.idassemblee !== me.idassemblee) {
      throw new ForbiddenException(
        'Messagerie limitée aux membres de votre assemblée',
      );
    }
  }

  private async getLatestReceiptId(
    readerId: number,
    authorId: number,
    ressourcetype: string,
  ): Promise<number> {
    const row = await this.prisma.interaction.findFirst({
      where: {
        type: DM_RECEIPT_TYPE,
        ressourcetype,
        idmembre: readerId,
        ressourceid: authorId,
      },
      orderBy: { createat: 'desc' },
    });
    if (!row?.contenu) return 0;
    const n = parseInt(row.contenu, 10);
    return Number.isNaN(n) ? 0 : n;
  }

  private async recordReceipt(
    readerId: number,
    authorId: number,
    ressourcetype: string,
    lastMessageId: number,
  ) {
    const current = await this.getLatestReceiptId(
      readerId,
      authorId,
      ressourcetype,
    );
    if (lastMessageId <= current) return;
    await this.prisma.interaction.create({
      data: {
        type: DM_RECEIPT_TYPE,
        ressourcetype,
        ressourceid: authorId,
        contenu: String(lastMessageId),
        idmembre: readerId,
      },
    });
  }

  private messageStatus(
    messageId: number,
    deliveredUpTo: number,
    readUpTo: number,
  ): MessageStatus {
    if (readUpTo >= messageId) return 'read';
    if (deliveredUpTo >= messageId) return 'delivered';
    return 'sent';
  }

  private mapMessageRow(
    m: {
      idinteraction: number;
      contenu: string | null;
      createat: Date;
      updateat: Date;
      idmembre: number;
    },
    viewerId: number,
    status?: MessageStatus,
  ) {
    const raw = m.contenu ?? '';
    let deleted = false;
    let deletedBy: string | null = null;
    let contenu = raw;
    if (raw.startsWith(DM_DELETED_PREFIX)) {
      deleted = true;
      deletedBy = raw.slice(DM_DELETED_PREFIX.length).trim() || 'Un membre';
      contenu = '';
    }

    const imageParsed = !deleted ? parseImageContenu(raw) : null;
    if (imageParsed) {
      return {
        id: m.idinteraction,
        messageType: 'image' as const,
        imageUrl: imageParsed.imageUrl,
        contenu: imageParsed.caption,
        deleted: false,
        deletedBy: null,
        edited: false,
        sentAt: m.createat,
        isMine: m.idmembre === viewerId,
        senderId: m.idmembre,
        status,
      };
    }

    const edited =
      !deleted &&
      new Date(m.updateat).getTime() - new Date(m.createat).getTime() > 3000;

    return {
      id: m.idinteraction,
      messageType: 'text' as const,
      imageUrl: null,
      contenu,
      deleted,
      deletedBy,
      edited,
      sentAt: m.createat,
      isMine: m.idmembre === viewerId,
      senderId: m.idmembre,
      status,
    };
  }

  private async getMessageForOwner(idmembre: number, messageId: number) {
    const msg = await this.prisma.interaction.findUnique({
      where: { idinteraction: messageId },
    });
    if (!msg) throw new NotFoundException('Message introuvable');
    if (msg.idmembre !== idmembre) {
      throw new ForbiddenException('Vous ne pouvez modifier que vos messages');
    }
    if (msg.type !== DM_INTERACTION_TYPE) {
      throw new ForbiddenException('Type de message invalide');
    }
    if (
      msg.ressourcetype !== DM_RESSOURCE_TYPE &&
      msg.ressourcetype !== DM_GROUP_RESOURCE_TYPE
    ) {
      throw new ForbiddenException('Message non modifiable');
    }
    if ((msg.contenu ?? '').startsWith(DM_DELETED_PREFIX)) {
      throw new BadRequestException('Ce message a été supprimé');
    }
    if (isImageContenu(msg.contenu ?? '')) {
      throw new BadRequestException('Les photos ne peuvent pas être modifiées');
    }
    return msg;
  }

  private async syncIncomingReceipts(
    viewerId: number,
    partnerId: number,
    messages: { idinteraction: number; idmembre: number }[],
  ) {
    const fromPartner = messages.filter((m) => m.idmembre === partnerId);
    if (fromPartner.length === 0) return;
    const maxId = Math.max(...fromPartner.map((m) => m.idinteraction));
    const maxAll = Math.max(...messages.map((m) => m.idinteraction));
    await this.recordReceipt(
      viewerId,
      partnerId,
      DM_DELIVERED_RESOURCE_TYPE,
      maxId,
    );
    await this.recordReceipt(
      viewerId,
      partnerId,
      DM_READ_RESOURCE_TYPE,
      maxAll,
    );
  }

  private async getGroupsForMember(idmembre: number, idassemblee: number) {
    const file = await readDmGroupsFile();
    return file.groups.filter(
      (g) =>
        g.idassemblee === idassemblee &&
        (g.memberIds.includes(idmembre) || g.createdBy === idmembre),
    );
  }

  private async assertGroupMember(idmembre: number, groupId: number) {
    const idassemblee = await this.getMyAssemblee(idmembre);
    const groups = await this.getGroupsForMember(idmembre, idassemblee);
    const group = groups.find((g) => g.id === groupId);
    if (!group) {
      throw new ForbiddenException('Groupe introuvable ou accès refusé');
    }
    return group;
  }

  private async getHiddenPartnerIds(idmembre: number): Promise<Set<number>> {
    const rows = await this.prisma.interaction.findMany({
      where: {
        type: DM_RECEIPT_TYPE,
        ressourcetype: DM_HIDE_RESOURCE_TYPE,
        idmembre,
      },
      select: { ressourceid: true },
    });
    return new Set(
      rows.map((r) => r.ressourceid).filter((id): id is number => id != null),
    );
  }

  async hideDirectConversation(idmembre: number, partnerId: number) {
    await this.assertSameAssemblee(idmembre, partnerId);
    const existing = await this.prisma.interaction.findFirst({
      where: {
        type: DM_RECEIPT_TYPE,
        ressourcetype: DM_HIDE_RESOURCE_TYPE,
        idmembre,
        ressourceid: partnerId,
      },
    });
    if (!existing) {
      await this.prisma.interaction.create({
        data: {
          type: DM_RECEIPT_TYPE,
          ressourcetype: DM_HIDE_RESOURCE_TYPE,
          ressourceid: partnerId,
          idmembre,
          contenu: 'hidden',
        },
      });
    }
    return { ok: true };
  }

  async listThreads(idmembre: number) {
    const idassemblee = await this.getMyAssemblee(idmembre);
    const hidden = await this.getHiddenPartnerIds(idmembre);

    const rows = await this.prisma.interaction.findMany({
      where: {
        ressourcetype: DM_RESSOURCE_TYPE,
        type: DM_INTERACTION_TYPE,
        OR: [{ idmembre }, { ressourceid: idmembre }],
      },
      orderBy: { createat: 'desc' },
      take: 500,
    });

    const lastByPartner = new Map<number, (typeof rows)[0]>();
    for (const row of rows) {
      const partnerId =
        row.idmembre === idmembre ? row.ressourceid : row.idmembre;
      if (!partnerId || partnerId === idmembre) continue;
      if (!lastByPartner.has(partnerId)) lastByPartner.set(partnerId, row);
    }

    const partnerIds = [...lastByPartner.keys()];
    const members =
      partnerIds.length > 0
        ? await this.prisma.membre.findMany({
            where: { idmembre: { in: partnerIds } },
            include: this.memberInclude(),
          })
        : [];

    const memberMap = new Map(
      members.map((m) => [m.idmembre, this.formatMember(m as MemberPerson)]),
    );

    const directThreads = [...lastByPartner.entries()]
      .map(([partnerId, last]) => {
        if (hidden.has(partnerId)) return null;
        const partner = memberMap.get(partnerId);
        if (!partner) return null;
        const preview = threadPreviewFromContenu(
          last.contenu ?? '',
          last.idmembre === idmembre,
        );
        return {
          kind: 'direct' as const,
          partnerId,
          partner,
          group: null,
          lastMessage: {
            id: last.idinteraction,
            contenu: preview,
            sentAt: last.createat,
            isMine: last.idmembre === idmembre,
          },
        };
      })
      .filter(Boolean);

    const myGroups = await this.getGroupsForMember(idmembre, idassemblee);
    const groupRows = await this.prisma.interaction.findMany({
      where: {
        ressourcetype: DM_GROUP_RESOURCE_TYPE,
        type: DM_INTERACTION_TYPE,
        ressourceid: { in: myGroups.map((g) => g.id) },
      },
      orderBy: { createat: 'desc' },
      take: 200,
    });

    const lastByGroup = new Map<number, (typeof groupRows)[0]>();
    for (const row of groupRows) {
      if (row.ressourceid && !lastByGroup.has(row.ressourceid)) {
        lastByGroup.set(row.ressourceid, row);
      }
    }

    const groupThreads = myGroups
      .map((g) => {
        const last = lastByGroup.get(g.id);
        if (!last) return null;
        const preview = threadPreviewFromContenu(
          last.contenu ?? '',
          last.idmembre === idmembre,
        );
        return {
          kind: 'group' as const,
          partnerId: null,
          partner: null,
          group: {
            id: g.id,
            name: g.name,
            memberCount: g.memberIds.length,
            photoUrl: g.photoUrl ?? null,
          },
          lastMessage: {
            id: last.idinteraction,
            contenu: preview,
            sentAt: last.createat,
            isMine: last.idmembre === idmembre,
          },
        };
      })
      .filter(Boolean);

    const threads = [...directThreads, ...groupThreads].sort(
      (a, b) =>
        new Date(b!.lastMessage.sentAt).getTime() -
        new Date(a!.lastMessage.sentAt).getTime(),
    );

    return { threads };
  }

  async getMessages(
    idmembre: number,
    partnerId: number,
    limit = 50,
    offset = 0,
  ) {
    await this.assertSameAssemblee(idmembre, partnerId);
    const take = Math.min(Math.max(limit, 1), 100);
    const skip = Math.max(offset, 0);

    const where = {
      ressourcetype: DM_RESSOURCE_TYPE,
      type: DM_INTERACTION_TYPE,
      OR: [
        { idmembre, ressourceid: partnerId },
        { idmembre: partnerId, ressourceid: idmembre },
      ],
    };

    const [messagesDesc, total, partner, deliveredUpTo, readUpTo] =
      await Promise.all([
        this.prisma.interaction.findMany({
          where,
          orderBy: { createat: 'desc' },
          skip,
          take,
        }),
        this.prisma.interaction.count({ where }),
        this.prisma.membre.findUnique({
          where: { idmembre: partnerId },
          include: this.memberInclude(),
        }),
        this.getLatestReceiptId(
          partnerId,
          idmembre,
          DM_DELIVERED_RESOURCE_TYPE,
        ),
        this.getLatestReceiptId(partnerId, idmembre, DM_READ_RESOURCE_TYPE),
      ]);

    if (!partner) throw new NotFoundException('Destinataire introuvable');

    const messages = [...messagesDesc].reverse();

    if (skip === 0 && messages.length > 0) {
      await this.syncIncomingReceipts(idmembre, partnerId, messages);
    }

    return {
      partner: this.formatMember(partner as MemberPerson),
      messages: messages.map((m) => ({
        ...this.mapMessageRow(
          m,
          idmembre,
          m.idmembre === idmembre
            ? this.messageStatus(m.idinteraction, deliveredUpTo, readUpTo)
            : undefined,
        ),
      })),
      receipts: {
        deliveredUpTo,
        readUpTo,
      },
      pagination: {
        total,
        limit: take,
        offset: skip,
        hasMore: skip + messages.length < total,
      },
    };
  }

  async markRead(idmembre: number, partnerId: number, lastMessageId: number) {
    await this.assertSameAssemblee(idmembre, partnerId);
    await this.recordReceipt(
      idmembre,
      partnerId,
      DM_READ_RESOURCE_TYPE,
      lastMessageId,
    );
    const maxFromPartner = await this.prisma.interaction.aggregate({
      where: {
        ressourcetype: DM_RESSOURCE_TYPE,
        type: DM_INTERACTION_TYPE,
        idmembre: partnerId,
        ressourceid: idmembre,
      },
      _max: { idinteraction: true },
    });
    const maxPartnerMsg = maxFromPartner._max.idinteraction ?? 0;
    if (maxPartnerMsg > 0) {
      await this.recordReceipt(
        idmembre,
        partnerId,
        DM_DELIVERED_RESOURCE_TYPE,
        maxPartnerMsg,
      );
    }
    return { ok: true, lastMessageId };
  }

  async sendMessage(idmembre: number, partnerId: number, contenu: string) {
    const text = contenu.trim();
    if (!text) throw new BadRequestException('Le message ne peut pas être vide');
    if (isImageContenu(text)) {
      const parsed = parseImageContenu(text);
      if (!parsed?.imageUrl.startsWith('https://')) {
        throw new BadRequestException('URL image invalide');
      }
      if (parsed.caption.length > 500) {
        throw new BadRequestException('Légende trop longue (max 500 caractères)');
      }
    } else if (text.length > DM_MAX_CONTENT_LENGTH) {
      throw new BadRequestException(
        `Message trop long (max ${DM_MAX_CONTENT_LENGTH} caractères)`,
      );
    }
    await this.assertSameAssemblee(idmembre, partnerId);

    const created = await this.prisma.interaction.create({
      data: {
        type: DM_INTERACTION_TYPE,
        ressourcetype: DM_RESSOURCE_TYPE,
        ressourceid: partnerId,
        contenu: text,
        idmembre,
      },
    });

    return this.mapMessageRow(created, idmembre, 'sent');
  }

  async sendDirectImageMessage(
    idmembre: number,
    partnerId: number,
    file: Express.Multer.File,
    caption?: string,
  ) {
    if (!file?.buffer?.length) {
      throw new BadRequestException('Image requise');
    }
    const result = await this.cloudinaryService.uploadImage(
      file.buffer,
      'ccb-dm-chat',
    );
    return this.sendMessage(
      idmembre,
      partnerId,
      buildImageContenu(result.secure_url, caption),
    );
  }

  async sendGroupImageMessage(
    idmembre: number,
    groupId: number,
    file: Express.Multer.File,
    caption?: string,
  ) {
    if (!file?.buffer?.length) {
      throw new BadRequestException('Image requise');
    }
    const result = await this.cloudinaryService.uploadImage(
      file.buffer,
      'ccb-dm-chat',
    );
    return this.sendGroupMessage(
      idmembre,
      groupId,
      buildImageContenu(result.secure_url, caption),
    );
  }

  async editMessage(idmembre: number, messageId: number, contenu: string) {
    const text = contenu.trim();
    if (!text) throw new BadRequestException('Le message ne peut pas être vide');
    if (text.startsWith(DM_DELETED_PREFIX) || isImageContenu(text)) {
      throw new BadRequestException('Contenu invalide');
    }
    await this.getMessageForOwner(idmembre, messageId);
    const updated = await this.prisma.interaction.update({
      where: { idinteraction: messageId },
      data: { contenu: text, updateat: new Date() },
    });
    return this.mapMessageRow(updated, idmembre, 'sent');
  }

  async deleteMessage(idmembre: number, messageId: number) {
    await this.getMessageForOwner(idmembre, messageId);
    const membre = await this.prisma.membre.findUnique({
      where: { idmembre },
      include: this.memberInclude(),
    });
    if (!membre) throw new NotFoundException('Membre introuvable');
    const name = this.formatMember(membre as MemberPerson).fullName;
    const updated = await this.prisma.interaction.update({
      where: { idinteraction: messageId },
      data: {
        contenu: `${DM_DELETED_PREFIX}${name}`,
        updateat: new Date(),
      },
    });
    return this.mapMessageRow(updated, idmembre);
  }

  async listContacts(idmembre: number, search?: string) {
    const idassemblee = await this.getMyAssemblee(idmembre);
    const q = search?.trim();
    const members = await this.prisma.membre.findMany({
      where: {
        idassemblee,
        idmembre: { not: idmembre },
        ...(q
          ? {
              personne: {
                OR: [
                  { nom: { contains: q, mode: 'insensitive' } },
                  { prenom: { contains: q, mode: 'insensitive' } },
                ],
              },
            }
          : {}),
      },
      include: this.memberInclude(),
      orderBy: [{ personne: { prenom: 'asc' } }],
      take: 60,
    });
    const contacts = members
      .map((m) => {
        if (!m.personne) return null;
        return this.formatMember(m as MemberPerson);
      })
      .filter((c): c is ReturnType<ConversationsService['formatMember']> => c !== null);
    return { contacts };
  }

  async listGroups(idmembre: number) {
    const idassemblee = await this.getMyAssemblee(idmembre);
    const groups = await this.getGroupsForMember(idmembre, idassemblee);
    return { groups };
  }

  async createGroup(
    idmembre: number,
    name: string,
    memberIds: number[],
  ) {
    const idassemblee = await this.getMyAssemblee(idmembre);
    const uniqueIds = [...new Set(memberIds.filter((id) => id !== idmembre))];
    if (uniqueIds.length === 0) {
      throw new BadRequestException('Ajoutez au moins un membre au groupe');
    }
    if (uniqueIds.length > DM_GROUP_MAX_MEMBERS) {
      throw new BadRequestException(
        `Maximum ${DM_GROUP_MAX_MEMBERS} membres par groupe`,
      );
    }

    for (const mid of uniqueIds) {
      await this.assertSameAssemblee(idmembre, mid);
    }

    const file = await readDmGroupsFile();
    if (file.groups.filter((g) => g.idassemblee === idassemblee).length >= DM_GROUPS_MAX) {
      throw new BadRequestException('Limite de groupes atteinte pour cette assemblée');
    }

    const nextId =
      file.groups.reduce((max, g) => Math.max(max, g.id), 0) + 1;
    const allMembers = [idmembre, ...uniqueIds];
    const group: DmGroupDto = {
      id: nextId,
      name: name.trim(),
      idassemblee,
      memberIds: allMembers,
      createdBy: idmembre,
      createdAt: new Date().toISOString(),
    };
    file.groups.push(group);
    await writeDmGroupsFile(file);
    return { group };
  }

  async getGroupMessages(
    idmembre: number,
    groupId: number,
    limit = 50,
    offset = 0,
  ) {
    const group = await this.assertGroupMember(idmembre, groupId);
    const take = Math.min(Math.max(limit, 1), 100);
    const skip = Math.max(offset, 0);

    const where = {
      ressourcetype: DM_GROUP_RESOURCE_TYPE,
      type: DM_INTERACTION_TYPE,
      ressourceid: groupId,
    };

    const [messagesDesc, total] = await Promise.all([
      this.prisma.interaction.findMany({
        where,
        orderBy: { createat: 'desc' },
        skip,
        take,
      }),
      this.prisma.interaction.count({ where }),
    ]);

    const messages = [...messagesDesc].reverse();

    const senderIds = [...new Set(messages.map((m) => m.idmembre))];
    const senders =
      senderIds.length > 0
        ? await this.prisma.membre.findMany({
            where: { idmembre: { in: senderIds } },
            include: this.memberInclude(),
          })
        : [];
    const senderMap = new Map(
      senders.map((s) => [s.idmembre, this.formatMember(s as MemberPerson)]),
    );

    return {
      group: {
        id: group.id,
        name: group.name,
        memberCount: group.memberIds.length,
        photoUrl: group.photoUrl ?? null,
      },
      messages: messages.map((m) => ({
        ...this.mapMessageRow(
          m,
          idmembre,
          m.idmembre === idmembre ? ('sent' as MessageStatus) : undefined,
        ),
        sender: senderMap.get(m.idmembre) ?? null,
      })),
      pagination: {
        total,
        limit: take,
        offset: skip,
        hasMore: skip + messages.length < total,
      },
    };
  }

  async sendGroupMessage(
    idmembre: number,
    groupId: number,
    contenu: string,
  ) {
    const text = contenu.trim();
    if (!text) throw new BadRequestException('Le message ne peut pas être vide');
    if (isImageContenu(text)) {
      const parsed = parseImageContenu(text);
      if (!parsed?.imageUrl.startsWith('https://')) {
        throw new BadRequestException('URL image invalide');
      }
    } else if (text.length > DM_MAX_CONTENT_LENGTH) {
      throw new BadRequestException(
        `Message trop long (max ${DM_MAX_CONTENT_LENGTH} caractères)`,
      );
    }
    await this.assertGroupMember(idmembre, groupId);

    const created = await this.prisma.interaction.create({
      data: {
        type: DM_INTERACTION_TYPE,
        ressourcetype: DM_GROUP_RESOURCE_TYPE,
        ressourceid: groupId,
        contenu: text,
        idmembre,
      },
    });

    return this.mapMessageRow(created, idmembre, 'sent');
  }

  async leaveGroup(idmembre: number, groupId: number) {
    const file = await readDmGroupsFile();
    const group = file.groups.find((g) => g.id === groupId);
    if (!group) throw new NotFoundException('Groupe introuvable');
    if (!group.memberIds.includes(idmembre)) {
      throw new ForbiddenException('Vous n\'êtes pas membre de ce groupe');
    }
    if (group.memberIds.length === 1) {
      file.groups = file.groups.filter((g) => g.id !== groupId);
    } else {
      group.memberIds = group.memberIds.filter((id) => id !== idmembre);
      if (group.createdBy === idmembre) {
        group.createdBy = group.memberIds[0];
      }
    }
    await writeDmGroupsFile(file);
    return { ok: true };
  }

  async deleteGroup(idmembre: number, groupId: number) {
    const file = await readDmGroupsFile();
    const group = file.groups.find((g) => g.id === groupId);
    if (!group) throw new NotFoundException('Groupe introuvable');
    if (group.createdBy !== idmembre) {
      throw new ForbiddenException('Seul le créateur peut supprimer le groupe');
    }
    file.groups = file.groups.filter((g) => g.id !== groupId);
    await writeDmGroupsFile(file);
    return { ok: true };
  }

  async addGroupMembers(
    idmembre: number,
    groupId: number,
    memberIds: number[],
  ) {
    const group = await this.assertGroupMember(idmembre, groupId);
    const unique = [...new Set(memberIds.filter((id) => id !== idmembre))];
    if (unique.length === 0) {
      throw new BadRequestException('Aucun membre à ajouter');
    }
    for (const mid of unique) {
      await this.assertSameAssemblee(idmembre, mid);
    }
    const file = await readDmGroupsFile();
    const g = file.groups.find((x) => x.id === groupId);
    if (!g) throw new NotFoundException('Groupe introuvable');
    const toAdd = unique.filter((id) => !g.memberIds.includes(id));
    if (g.memberIds.length + toAdd.length > DM_GROUP_MAX_MEMBERS) {
      throw new BadRequestException(
        `Maximum ${DM_GROUP_MAX_MEMBERS} membres par groupe`,
      );
    }
    g.memberIds = [...g.memberIds, ...toAdd];
    await writeDmGroupsFile(file);
    return { added: toAdd.length, memberIds: g.memberIds };
  }

  async uploadGroupPhoto(
    idmembre: number,
    groupId: number,
    file: Express.Multer.File,
  ) {
    const group = await this.assertGroupMember(idmembre, groupId);
    if (group.createdBy !== idmembre) {
      throw new ForbiddenException(
        'Seul le créateur peut modifier la photo du groupe',
      );
    }
    if (!file?.buffer?.length) {
      throw new BadRequestException('Image requise');
    }
    const result = await this.cloudinaryService.uploadImage(
      file.buffer,
      'ccb-dm-groups',
    );
    const data = await readDmGroupsFile();
    const g = data.groups.find((x) => x.id === groupId);
    if (!g) throw new NotFoundException('Groupe introuvable');
    g.photoUrl = result.secure_url;
    await writeDmGroupsFile(data);
    return { photoUrl: g.photoUrl };
  }

  async getGroupInfo(idmembre: number, groupId: number) {
    const group = await this.assertGroupMember(idmembre, groupId);
    const [creator, members] = await Promise.all([
      this.prisma.membre.findUnique({
        where: { idmembre: group.createdBy },
        include: this.memberInclude(),
      }),
      this.prisma.membre.findMany({
        where: { idmembre: { in: group.memberIds } },
        include: this.memberInclude(),
        orderBy: [{ personne: { prenom: 'asc' } }],
      }),
    ]);

    return {
      group: {
        id: group.id,
        name: group.name,
        memberCount: group.memberIds.length,
        createdAt: group.createdAt,
        photoUrl: group.photoUrl ?? null,
      },
      creator: creator
        ? this.formatMember(creator as MemberPerson)
        : null,
      members: members.map((m) => this.formatMember(m as MemberPerson)),
      isCreator: group.createdBy === idmembre,
    };
  }
}
