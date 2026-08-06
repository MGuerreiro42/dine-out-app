import { getPlacePhotoUrl } from '@/mocks/repository';
import { PhotoMediaResponseSchema } from '@/lib/googlePlaces/schema';

/**
 * Resolves a Places (New) photo reference to a real, displayable URL —
 * mirrors the real API's two-hop photo flow (get the place, then resolve
 * each photo reference via its own request) instead of shortcutting it.
 */
export async function resolvePlacePhotoUrl(photoName: string): Promise<string> {
  const data = await getPlacePhotoUrl(photoName);
  if (!data) {
    throw new Error(`No resolved photo URL for "${photoName}"`);
  }
  return PhotoMediaResponseSchema.parse(data).photoUri;
}
