// Re-export des modèles partagés entre le site principal et le CMS

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

export interface ServiceOffer {
  id: string;
  label: string;
  price: number;
  unit?: string;
}

export interface Service {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  includes: string[];
  offers: ServiceOffer[];
  image?: string;
  note?: string;
  order_index?: number;
}

export interface Testimonial {
  id: string;
  name: string;
  avatar?: string;
  avatar_url?: string;
  text: string;
  rating: number;
}

export interface InstagramPost {
  id: string;
  image_url: string;
  caption: string;
  link: string;
  order_index: number;
}

export interface SiteContent {
  key: string;
  value: string;
  updated_at?: string;
}

export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  message: string;
  gdprAccepted: boolean;
}
