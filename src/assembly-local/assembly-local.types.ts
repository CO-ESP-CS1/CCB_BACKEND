export type EvangelizationSoul = {
  id: string;
  prenom: string;
  nom: string;
  age: number;
  baptise: boolean;
  invitePar: string;
  createdAt: string;
};

export type DepartmentHelper = {
  id: string;
  prenom: string;
  nom: string;
  age: number;
  departementLibelle: string;
  createdAt: string;
};

export type AttendanceRecord = {
  date: string;
  membreIds: number[];
  soulIds: string[];
  helperIds: string[];
  updatedAt: string;
};

export type FinancePost = {
  id: string;
  libelle: string;
  date: string;
  createdAt: string;
  updatedAt: string;
};

export type FinanceEntry = {
  id: string;
  type: 'income' | 'expense';
  date: string;
  postId: string | null;
  libelle: string;
  montant: number;
  createdAt: string;
  updatedAt: string;
};

export type FormationItem = {
  id: string;
  titre: string;
  description: string;
  pdfUrl: string;
  pdfViewUrl: string;
  pdfPublicId: string;
  originalFilename: string;
  createdAt: string;
  updatedAt: string;
};

export type AssemblyLocalFile = {
  updatedAt: string;
  evangelizationSouls: EvangelizationSoul[];
  departmentHelpers: DepartmentHelper[];
  attendanceRecords: AttendanceRecord[];
  financePosts: FinancePost[];
  financeEntries: FinanceEntry[];
  formations: FormationItem[];
};

export const EMPTY_ASSEMBLY_LOCAL: AssemblyLocalFile = {
  updatedAt: new Date().toISOString(),
  evangelizationSouls: [],
  departmentHelpers: [],
  attendanceRecords: [],
  financePosts: [],
  financeEntries: [],
  formations: [],
};
