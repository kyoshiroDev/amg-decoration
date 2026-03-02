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
}
