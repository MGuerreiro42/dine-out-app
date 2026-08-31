import { useMutation } from '@tanstack/react-query';

import { login } from '@/mocks/repository';
import { useAuthStore } from '@/stores/auth';

export function useLoginMutation() {
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      return useAuthStore.getState().setSession(data);
    },
  });
}
