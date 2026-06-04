export type EngagementBadgeDto = {
  id: string;
  title: string;
  description: string;
  earned: boolean;
  progress: number;
  target: number;
  icon: string;
};

export type EngagementInsightsDto = {
  badges: EngagementBadgeDto[];
  stats: {
    likes: number;
    comments: number;
    reactions: number;
    seancesPresent: number;
    inscriptions: number;
  };
};

export type CellGroupDto = {
  iddepartement: number;
  nomdepartement: string;
};

export type WeekSeanceDto = {
  idseance: number;
  titreseance: string | null;
  heuredebut: string;
  heurefin: string | null;
  lieu: string | null;
  activiteLabel: string | null;
  confirmed: boolean;
};
