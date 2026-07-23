import { z } from 'zod';

export const CuisineSchema = z.object({
  id: z.string(),
  label: z.string(),
  photo: z.string(),
});
export type Cuisine = z.infer<typeof CuisineSchema>;

export const OccasionSchema = z.object({
  id: z.string(),
  label: z.string(),
  initial: z.string(),
});
export type Occasion = z.infer<typeof OccasionSchema>;

export const AmbientSchema = z.object({
  id: z.string(),
  label: z.string(),
});
export type Ambient = z.infer<typeof AmbientSchema>;

export const BenefitSchema = z.object({
  text: z.string(),
});
export type Benefit = z.infer<typeof BenefitSchema>;

export const DiscoveryTaxonomiesSchema = z.object({
  cuisines: z.array(CuisineSchema),
  occasions: z.array(OccasionSchema),
  ambients: z.array(AmbientSchema),
  benefits: z.array(BenefitSchema),
});
export type DiscoveryTaxonomies = z.infer<typeof DiscoveryTaxonomiesSchema>;
