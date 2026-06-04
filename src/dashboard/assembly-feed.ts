export type AssemblyFeedItemType =
  | 'publication'
  | 'video'
  | 'annonce'
  | 'seance'
  | 'live_upcoming';

export type AssemblyFeedItemDto = {
  id: string;
  type: AssemblyFeedItemType;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  date: string;
  route?: string;
  meta?: Record<string, string | number>;
};

export type AssemblyFeedResponseDto = {
  assembleeName: string | null;
  items: AssemblyFeedItemDto[];
};

export type UpcomingLiveDto = {
  idlive: number;
  titrelive: string | null;
  descriptionlive: string | null;
  heuredebut: string;
  heurefin: string | null;
};
