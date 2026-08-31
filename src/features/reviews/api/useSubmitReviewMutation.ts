import { useMutation, useQueryClient } from '@tanstack/react-query';

import { submitReview } from '@/mocks/repository';

export function useSubmitReviewMutation(restaurantId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { rating: number; text: string }) => submitReview(restaurantId, payload),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ['restaurant', restaurantId] });
    },
  });
}
