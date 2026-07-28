import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text } from 'react-native';

import { AuthForm } from '@/features/auth/components';
import { useAuthStore } from '@/stores/auth';

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [isSignup, setIsSignup] = useState(false);

  return (
    <ScrollView className="flex-1 bg-white">
      <Pressable
        onPress={() => router.replace('/')}
        className="mx-6 mt-6 h-9 w-9 items-center justify-center rounded-full bg-sand"
      >
        <Text className="text-lg leading-none text-ink">‹</Text>
      </Pressable>
      <AuthForm
        isSignup={isSignup}
        onToggleMode={() => setIsSignup((v) => !v)}
        onSubmit={() => {
          login();
          router.replace('/profile');
        }}
      />
    </ScrollView>
  );
}
