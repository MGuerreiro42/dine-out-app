import { useMutation } from '@tanstack/react-query';

import { signup } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';

export function useSignupMutation() {
  return useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      return useAuthStore.getState().setSession(data);
    },
  });
}
