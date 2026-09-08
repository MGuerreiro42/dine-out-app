import { useMutation } from '@tanstack/react-query';

import { signup } from '@/mocks/repository';
import { useAuthStore } from '@/stores/auth';

export function useSignupMutation() {
  return useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      return useAuthStore.getState().setSession(data);
    },
  });
}
