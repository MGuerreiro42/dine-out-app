import { apiClient } from '@/lib/apiClient';
import { PhotoMediaResponseSchema } from '@/lib/googlePlaces/schema';

export const GOOGLE_PLACES_BASE_URL = 'https://places.googleapis.com/v1';

/**
 * Resolves a Places (New) photo reference to a real, displayable URL —
 * mirrors the real API's two-hop photo flow (get the place, then resolve
 * each photo reference via its own request) instead of shortcutting it.
 */
export async function resolvePlacePhotoUrl(photoName: string): Promise<string> {
  const data = await apiClient.get<unknown>(`${GOOGLE_PLACES_BASE_URL}/photos/${photoName}/media`);
  return PhotoMediaResponseSchema.parse(data).photoUri;
}
