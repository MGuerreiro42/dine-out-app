import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/ui';
import { useLocationStore } from '@/stores/location';

export function CurrentLocationCard() {
  const label = useLocationStore((s) => s.label);
  const address = useLocationStore((s) => s.address);
  const resolveLocation = useLocationStore((s) => s.resolveLocation);

  return (
    <Pressable
      onPress={() => resolveLocation()}
      className="flex-row items-center gap-3 rounded-2xl border border-sand p-3"
    >
      <View className="h-11 w-11 items-center justify-center rounded-full bg-[#eef2ff]">
        <Icon spec={{ set: 'Ionicons', name: 'navigate' }} size={18} color="#4f46e5" />
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
