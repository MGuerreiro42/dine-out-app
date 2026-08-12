import { Alert, Pressable, View } from 'react-native';

import { Icon } from '@/components/ui';
import { useFavoritesStore } from '@/stores/favorites';

const ICON_BUTTON_CLASS = 'h-9 w-9 items-center justify-center rounded-full bg-white/90';

type DetailHeaderActionsProps = {
  restaurantId: number;
};

// Simplified to match the reference (share + favorite only) — the previous
// location/settings icons were redundant with the tappable address row below
// and an undefined placeholder, respectively; see restaurant.md's changelog.
export function DetailHeaderActions({ restaurantId }: DetailHeaderActionsProps) {
  const isFavorite = useFavoritesStore((s) => s.isFavorite(restaurantId));
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);

  return (
    <View className="absolute right-3.5 top-3.5 gap-2">
      <Pressable
        onPress={() => Alert.alert('Simulação', 'Compartilhar este restaurante')}
        className={ICON_BUTTON_CLASS}
      >
        <Icon spec={{ set: 'Ionicons', name: 'share-outline' }} size={16} color="#374151" />
      </Pressable>
      <Pressable onPress={() => toggleFavorite(restaurantId)} className={ICON_BUTTON_CLASS}>
        <Icon
          spec={{ set: 'Ionicons', name: 'heart-outline' }}
          size={16}
          color={isFavorite ? '#e11d48' : '#374151'}
        />
      </Pressable>
    </View>
  );
}
