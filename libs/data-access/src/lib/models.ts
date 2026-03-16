import { z } from 'zod';

export const ProjectCategorySchema = z.enum(['salon', 'chambre', 'cuisine', 'terrasse', 'bureau', 'autre']);
export type ProjectCategory = z.infer<typeof ProjectCategorySchema>;

export const ProjectSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  images: z.array(z.string()),
  category: ProjectCategorySchema,
  roomType: z.string(),
});
export type Project = z.infer<typeof ProjectSchema>;

export const ServiceIncludeSchema = z.object({
  id: z.string(),
  service_id: z.string(),
  text: z.string(),
  order_index: z.number().default(0),
});
export type ServiceInclude = z.infer<typeof ServiceIncludeSchema>;

export const ServicePriceSchema = z.object({
  id: z.string(),
  service_id: z.string(),
  label: z.string(),
  price: z.number(),
  unit: z.string().nullish().transform(v => v ?? undefined),
  order_index: z.number().default(0),
});
export type ServicePrice = z.infer<typeof ServicePriceSchema>;

export const ServiceSchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string().nullish().transform(v => v ?? undefined),
  description: z.string(),
  includes: z.array(ServiceIncludeSchema).default([]),
  prices: z.array(ServicePriceSchema).default([]),
  image: z.string().nullish().transform(v => v ?? undefined),
  note: z.string().nullish().transform(v => v ?? undefined),
  order_index: z.number().default(0),
});
export type Service = z.infer<typeof ServiceSchema>;

export const TestimonialSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string().nullish().transform(v => v ?? undefined),
  avatar_url: z.string().nullish().transform(v => v ?? undefined),
  text: z.string(),
  rating: z.number().min(1).max(5),
});
export type Testimonial = z.infer<typeof TestimonialSchema>;

export const ContactFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10),
  gdprAccepted: z.literal(true),
});
export type ContactForm = z.infer<typeof ContactFormSchema>;

export const SeoConfigSchema = z.object({
  title: z.string(),
  description: z.string(),
  url: z.string(),
  image: z.string().optional(),
  jsonLd: z.record(z.string(), z.unknown()).optional(),
});
export type SeoConfig = z.infer<typeof SeoConfigSchema>;

// Interfaces supplémentaires utilisées par le CMS (non migrées vers Zod)
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