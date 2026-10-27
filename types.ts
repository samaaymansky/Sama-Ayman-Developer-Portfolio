export interface GameMeta {
  label: string;
  value: string;
  link?: string;
}

export interface GameFeature {
  title: string;
  text: string;
  image: string;
  caption: string;
}

export interface GalleryItem {
  image: string;
  caption: string;
}

export type HorrorSubgenre = 'Psychological Horror' | 'Action Horror' | 'Atmospheric Survival' | 'Sensory Horror';

export interface GameProject {
  id: string;
  title: string;
  subgenre: HorrorSubgenre;
  status: 'live' | 'progress' | 'planned';
  statusLabel: string;
  engine: string;
  genre: string;
  tagline: string;
  desc: string;
  thumb: string | null;
  banner: string | null;
  meta: GameMeta[];
  overview: string[];
  features: GameFeature[];
  gallery: GalleryItem[];
  mechanicsHighlights: {
    title: string;
    description: string;
  }[];
}

export interface SkillItem {
  id: string;
  name: string;
  description: string;
  iconName: string;
}
