import * as fs from 'fs/promises';
import * as path from 'path';

export const DM_GROUPS_MAX = 50;
export const DM_GROUP_MAX_MEMBERS = 30;

export type DmGroupDto = {
  id: number;
  name: string;
  idassemblee: number;
  memberIds: number[];
  createdBy: number;
  createdAt: string;
  photoUrl?: string | null;
};

export type DmGroupsFileDto = {
  updatedAt?: string;
  groups: DmGroupDto[];
};

const FILE = path.join(process.cwd(), 'data', 'dm-groups.json');

export async function readDmGroupsFile(): Promise<DmGroupsFileDto> {
  try {
    const raw = await fs.readFile(FILE, 'utf-8');
    const parsed = JSON.parse(raw) as DmGroupsFileDto;
    return { groups: parsed.groups ?? [], updatedAt: parsed.updatedAt };
  } catch {
    return { groups: [] };
  }
}

export async function writeDmGroupsFile(data: DmGroupsFileDto): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(
    FILE,
    JSON.stringify({ ...data, updatedAt: new Date().toISOString() }, null, 2),
    'utf-8',
  );
}
