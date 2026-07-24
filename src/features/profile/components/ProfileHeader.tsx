import { Text, View } from 'react-native';

import type { UserProfile } from '@/types';

type ProfileHeaderProps = {
  isLoggedIn: boolean;
  userProfile?: UserProfile;
};

export function ProfileHeader({ isLoggedIn, userProfile }: ProfileHeaderProps) {
  return (
    <View className="bg-ink px-4 pb-6 pt-8">
      {isLoggedIn && userProfile ? (
        <View className="mt-2 items-center gap-2.5">
          <View className="h-[72px] w-[72px] items-center justify-center rounded-full bg-gold">
            <Text className="text-2xl font-bold text-ink">{userProfile.initial}</Text>
          </View>
          <Text className="text-base font-bold text-white">{userProfile.name}</Text>
          <Text className="text-xs text-[#bdb6ae]">{userProfile.email}</Text>
        </View>
      ) : (
        <View className="mt-2 items-center gap-2">
          <View className="h-[72px] w-[72px] items-center justify-center rounded-full bg-[#2a2622]">
            <Text className="text-2xl text-muted">👤</Text>
          </View>
          <Text className="text-base font-bold text-white">Visitante</Text>
          <Text className="max-w-[260px] text-center text-xs text-[#bdb6ae]">
            Entre para acessar favoritos, pedidos e reservas
          </Text>
        </View>
      )}
    </View>
  );
}
