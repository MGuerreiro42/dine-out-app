import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView } from 'react-native';

import { Icon } from '@/components/ui';
import { useLoginMutation, useSignupMutation } from '@/features/auth/api';
import { AuthForm } from '@/features/auth/components';
import { ApiError } from '@/lib/apiClient';

export default function LoginScreen() {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const signupMutation = useSignupMutation();
  const loginMutation = useLoginMutation();

  const activeError = isSignup ? signupMutation.error : loginMutation.error;
  const isSubmitting = isSignup ? signupMutation.isPending : loginMutation.isPending;

  const submitError = useMemo(() => {
    if (!(activeError instanceof ApiError)) {
      return null;
    }
    if (isSignup && activeError.status === 409) {
      return { field: 'email' as const, message: 'Email already registered.' };
    }
    if (!isSignup && activeError.status === 401) {
      return { field: 'password' as const, message: 'Invalid email or password.' };
    }
    return null;
  }, [activeError, isSignup]);

  const handleSubmit = (values: { name?: string; email: string; password: string }) => {
    if (isSignup) {
      signupMutation.mutate(
        { name: values.name ?? '', email: values.email, password: values.password },
        { onSuccess: () => router.replace('/profile') },
      );
    } else {
      loginMutation.mutate(
        { email: values.email, password: values.password },
        { onSuccess: () => router.replace('/profile') },
      );
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <Pressable
        onPress={() => router.replace('/')}
        className="mx-lg mt-lg h-10 w-10 items-center justify-center rounded-full bg-sand"
      >
        <Icon spec={{ set: 'Ionicons', name: 'chevron-back' }} />
      </Pressable>
      <AuthForm
        isSignup={isSignup}
        onToggleMode={() => setIsSignup((v) => !v)}
        onSubmit={handleSubmit}
        submitError={submitError}
        isSubmitting={isSubmitting}
      />
    </ScrollView>
  );
}
