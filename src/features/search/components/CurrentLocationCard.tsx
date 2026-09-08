import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/ui';
import { useLocationStore } from '@/stores/location';
import { colors, iconSize } from '@/theme';

export function CurrentLocationCard() {
  const label = useLocationStore((s) => s.label);
  const address = useLocationStore((s) => s.address);
  const resolveLocation = useLocationStore((s) => s.resolveLocation);

  return (
    <Pressable
      onPress={() => resolveLocation()}
      className="flex-row items-center gap-sm2 rounded-lg border border-sand p-sm2"
    >
      <View className="h-11 w-11 items-center justify-center rounded-full bg-accent-tint">
        <Icon spec={{ set: 'Ionicons', name: 'navigate' }} size={iconSize.ui} color={colors.accent} />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-bold text-ink">{label}</Text>
        <Text className="text-xs text-muted" numberOfLines={1}>
          {address}
        </Text>
      </View>
    </Pressable>
  );
}
