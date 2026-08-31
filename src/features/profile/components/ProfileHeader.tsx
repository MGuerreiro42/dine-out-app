import { Text, View } from 'react-native';

import { Icon } from '@/components/ui';
import { colors, iconSize } from '@/theme';
import type { UserProfile } from '@/types';

type ProfileHeaderProps = {
  isLoggedIn: boolean;
  userProfile?: UserProfile;
};

export function ProfileHeader({ isLoggedIn, userProfile }: ProfileHeaderProps) {
  return (
    <View className="bg-ink px-md pb-lg pt-xl">
      {isLoggedIn && userProfile ? (
        <View className="mt-sm items-center gap-sm2">
          <View className="h-[72px] w-[72px] items-center justify-center rounded-full bg-accent">
            <Text className="text-2xl font-bold text-white">{userProfile.initial}</Text>
          </View>
          <Text className="text-base font-bold text-white">{userProfile.name}</Text>
          <Text className="text-xs text-ink-subtle">{userProfile.email}</Text>
        </View>
      ) : (
        <View className="mt-sm items-center gap-sm">
          <View className="h-[72px] w-[72px] items-center justify-center rounded-full bg-ink-muted">
            <Icon spec={{ set: 'Ionicons', name: 'person-circle-outline' }} size={iconSize.empty} color={colors.inkFaint} />
          </View>
          <Text className="text-base font-bold text-white">Guest</Text>
          <Text className="max-w-[260px] text-center text-xs text-ink-subtle">
            Log in to access favorites, orders and reservations
          </Text>
        </View>
      )}
    </View>
  );
}
