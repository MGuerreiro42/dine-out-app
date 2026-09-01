import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/ui';
import { colors, iconSize } from '@/theme';

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
      <View className="px-md py-md2">
        <Pressable onPress={onLogin} className="items-center rounded-lg bg-accent py-md">
          <Text className="text-sm font-bold text-white">Log in or sign up</Text>
        </Pressable>
        <Text className="mt-md text-center text-xs text-muted">
          Create an account to favorite restaurants, track orders and book reservations in one tap.
        </Text>
      </View>

      <View className="border-t border-sand-border px-md pb-md2 pt-sm">
        <Text className="py-sm2 text-base font-bold text-ink">Discover without an account</Text>
        <Pressable
          onPress={onExploreRestaurants}
          className="flex-row items-center justify-between border-b border-sand py-md"
        >
          <View className="flex-row items-center gap-sm2">
            <View className="h-9 w-9 items-center justify-center rounded-lg bg-sand">
              <Icon spec={{ set: 'Ionicons', name: 'search-outline' }} size={iconSize.inline} color={colors.accent} />
            </View>
            <Text className="text-sm font-bold text-ink">Explore restaurants</Text>
          </View>
          <Icon spec={{ set: 'Ionicons', name: 'chevron-forward' }} size={iconSize.inline} color={colors.inkSubtle} />
        </Pressable>
        <Pressable
          onPress={onSearchOnMap}
          className="flex-row items-center justify-between border-b border-sand py-md"
        >
          <View className="flex-row items-center gap-sm2">
            <View className="h-9 w-9 items-center justify-center rounded-lg bg-sand">
              <Icon spec={{ set: 'Ionicons', name: 'location-outline' }} size={iconSize.inline} color={colors.accent} />
            </View>
            <Text className="text-sm font-bold text-ink">Search on the map</Text>
          </View>
          <Icon spec={{ set: 'Ionicons', name: 'chevron-forward' }} size={iconSize.inline} color={colors.inkSubtle} />
        </Pressable>
        <Pressable onPress={onNotificationPreferences} className="flex-row items-center justify-between py-md">
          <View className="flex-row items-center gap-sm2">
            <View className="h-9 w-9 items-center justify-center rounded-lg bg-sand">
              <Icon
                spec={{ set: 'Ionicons', name: 'notifications-outline' }}
                size={iconSize.inline}
                color={colors.accent}
              />
            </View>
            <Text className="text-sm font-bold text-ink">Notification preferences</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}
