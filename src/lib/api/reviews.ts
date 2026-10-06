import { apiPost } from '@/lib/apiClient';
import { ReviewSchema } from '@/lib/api/schema';

export async function submitReview(restaurantId: number, payload: { rating: number; text: string }) {
  const data = await apiPost(`/restaurants/${restaurantId}/reviews`, payload);
  return ReviewSchema.parse(data);
}
