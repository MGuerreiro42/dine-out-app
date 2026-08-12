import { Pressable, ScrollView, Text } from 'react-native';

import type { Ambient } from '@/features/search/types';

type AmbientSelectorProps = {
  ambients: (Ambient & { isActive: boolean })[];
  onSelect: (id: string) => void;
};

// Local pill, not the shared Chip (also used by CategoryTabsRow on
// Category/Venue-Type pages, out of this round's scope) — active state uses
// a low-opacity tinted background instead of a solid fill, matching the
// outlined/low-opacity convention used across this Home redesign.
export function AmbientSelector({ ambients, onSelect }: AmbientSelectorProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingHorizontal: 16, paddingVertical: 4 }}
    >
      {ambients.map((ambient) => (
        <Pressable
          key={ambient.id}
          onPress={() => onSelect(ambient.id)}
          className={`rounded-full px-4 py-2 ${ambient.isActive ? 'bg-[#eef2ff]' : 'bg-[#f3f4f6]'}`}
        >
          <Text className={`text-sm font-bold ${ambient.isActive ? 'text-[#4f46e5]' : 'text-[#6b7280]'}`}>
            {ambient.label}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
