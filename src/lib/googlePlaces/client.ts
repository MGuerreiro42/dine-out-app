import { getPlacePhotoUrl } from '@/mocks/repository';
import { PhotoMediaResponseSchema } from '@/lib/googlePlaces/schema';

export async function resolvePlacePhotoUrl(photoName: string): Promise<string> {
  const data = await getPlacePhotoUrl(photoName);
  if (!data) {
    throw new Error(`No resolved photo URL for "${photoName}"`);
  }
  return PhotoMediaResponseSchema.parse(data).photoUri;
}
