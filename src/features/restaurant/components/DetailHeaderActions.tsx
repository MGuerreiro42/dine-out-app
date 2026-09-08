import { Pressable, View } from 'react-native';

import { Icon } from '@/components/ui';
import { useFavoritesStore } from '@/stores/favorites';
import { colors, iconSize } from '@/theme';

const ICON_BUTTON_CLASS = 'h-9 w-9 items-center justify-center rounded-full bg-white/90';

type DetailHeaderActionsProps = {
  restaurantId: number;
};

export function DetailHeaderActions({ restaurantId }: DetailHeaderActionsProps) {
  const isFavorite = useFavoritesStore((s) => s.isFavorite(restaurantId));
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);

  return (
    <View className="absolute right-md top-md gap-sm">
      <Pressable onPress={() => toggleFavorite(restaurantId)} className={ICON_BUTTON_CLASS}>
        <Icon
          spec={{ set: 'Ionicons', name: 'heart-outline' }}
          size={iconSize.header}
          color={isFavorite ? colors.danger : colors.inkMuted}
        />
      </Pressable>
    </View>
  );
}
