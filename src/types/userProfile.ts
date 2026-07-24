import { z } from 'zod';

export const UserProfileSchema = z.object({
  initial: z.string(),
  name: z.string(),
  email: z.string(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;
