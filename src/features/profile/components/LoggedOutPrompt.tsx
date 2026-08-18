import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/ui';

type LoggedOutPromptProps = {
  onLogin: () => void;
  onExploreRestaurants: () => void;
  onSearchOnMap: () => void;
  onNotificationPreferences: () => void;
};

export function LoggedOutPrompt({
  onLogin,
  onExploreRestaurants,
  onSearchOnMap,
  onNotificationPreferences,
}: LoggedOutPromptProps) {
  return (
    <View>
      <View className="px-4 py-5">
        <Pressable onPress={onLogin} className="items-center rounded-xl bg-ink py-3.5">
          <Text className="text-sm font-bold text-white">Log in or sign up</Text>
        </Pressable>
        <Text className="mt-3.5 text-center text-xs text-muted">
          Create an account to favorite restaurants, track orders and book reservations in one tap.
        </Text>
      </View>

      <View className="border-t border-gray-100 px-4 pb-5 pt-1.5">
        <Text className="py-3 text-base font-bold text-ink">Discover without an account</Text>
        <Pressable
          onPress={onExploreRestaurants}
          className="flex-row items-center justify-between border-b border-sand py-3.5"
        >
          <Text className="text-sm font-bold text-ink">Explore restaurants</Text>
          <Icon spec={{ set: 'Ionicons', name: 'chevron-forward' }} size={16} color="#d1d5db" />
        </Pressable>
        <Pressable
          onPress={onSearchOnMap}
          className="flex-row items-center justify-between border-b border-sand py-3.5"
        >
          <Text className="text-sm font-bold text-ink">Search on the map</Text>
          <Icon spec={{ set: 'Ionicons', name: 'chevron-forward' }} size={16} color="#d1d5db" />
        </Pressable>
        <Pressable onPress={onNotificationPreferences} className="py-3.5">
          <Text className="text-sm font-bold text-ink">Notification preferences</Text>
        </Pressable>
      </View>
    </View>
  );
}
