import { Text, View } from 'react-native';

import { Icon } from '@/components/ui';
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
          <View className="h-[72px] w-[72px] items-center justify-center rounded-full bg-accent">
            <Text className="text-2xl font-bold text-white">{userProfile.initial}</Text>
          </View>
          <Text className="text-base font-bold text-white">{userProfile.name}</Text>
          <Text className="text-xs text-[#bdb6ae]">{userProfile.email}</Text>
        </View>
      ) : (
        <View className="mt-2 items-center gap-2">
          <View className="h-[72px] w-[72px] items-center justify-center rounded-full bg-[#2a2622]">
            <Icon spec={{ set: 'Ionicons', name: 'person-circle-outline' }} size={40} color="#8a8580" />
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
