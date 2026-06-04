export const HOME_CAROUSEL_MAX_SLIDES = 10;

export type HomeCarouselSlideDto = {
  id: string;
  title: string;
  subtitle?: string;
  slideName: string;
  /** Texte long affiché sur la page détail au clic sur la bannière */
  detailDescription?: string;
  imageUrl?: string;
  fallbackKey?: 'banner1' | 'banner2' | 'banner3';
  /** Lien optionnel (bouton en bas de la page détail) */
  linkRoute?: string;
  linkLabel?: string;
  active?: boolean;
  order?: number;
};

export type HomeCarouselFileDto = {
  updatedAt?: string;
  slides: HomeCarouselSlideDto[];
};

export type HomeCarouselResponseDto = {
  updatedAt: string | null;
  slides: HomeCarouselSlideDto[];
};
