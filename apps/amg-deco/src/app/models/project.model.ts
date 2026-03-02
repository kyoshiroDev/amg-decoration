export type ProjectCategory =
  | 'salon'
  | 'chambre'
  | 'cuisine'
  | 'terrasse'
  | 'bureau'
  | 'autre';

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  images: string[];
  category: ProjectCategory;
  roomType: string;
}
