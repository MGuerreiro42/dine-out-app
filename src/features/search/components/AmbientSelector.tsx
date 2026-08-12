import { Pressable, ScrollView, Text, View } from 'react-native';

import { Icon } from '@/components/ui';
import { AMBIENT_ICONS, DEFAULT_AMBIENT_ICON } from '@/features/search/lib/taxonomyIcons';
import type { Ambient } from '@/features/search/types';

type AmbientSelectorProps = {
  ambients: (Ambient & { isActive: boolean })[];
  onSelect: (id: string) => void;
};

// Icon badges, matching CuisineSelector/OccasionSelector's shared visual
// pattern — not the shared Chip, which stays a plain text pill.
export function AmbientSelector({ ambients, onSelect }: AmbientSelectorProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 16, paddingHorizontal: 16, paddingVertical: 4 }}
    >
      {ambients.map((ambient) => (
        <Pressable key={ambient.id} onPress={() => onSelect(ambient.id)} className="items-center gap-1.5">
          <View
            className={`h-11 w-11 items-center justify-center rounded-full ${ambient.isActive ? 'bg-[#eef2ff]' : 'bg-[#f3f4f6]'}`}
          >
            <Icon
              spec={AMBIENT_ICONS[ambient.id] ?? DEFAULT_AMBIENT_ICON}
              size={18}
              color={ambient.isActive ? '#4f46e5' : '#1f2937'}
            />
          </View>
          <Text className={`text-[13px] font-bold ${ambient.isActive ? 'text-[#111827]' : 'text-[#6b7280]'}`}>
            {ambient.label}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
