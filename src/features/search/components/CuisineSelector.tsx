import { Pressable, ScrollView, Text, View } from 'react-native';

import { Icon, type IconSpec } from '@/components/ui';
import type { Cuisine } from '@/features/search/types';

// Presentation-only lookup — Cuisine's own mock data (`photo`) doesn't carry
// an icon, so this stays local to the one component that needs it, same as
// AMENITY_RULES-style derived lookups elsewhere in this codebase.
const CUISINE_ICONS: Record<string, IconSpec> = {
  churrasco: { set: 'MaterialCommunityIcons', name: 'fire' },
  mediterraneo: { set: 'MaterialCommunityIcons', name: 'bowl-mix' },
  italiana: { set: 'MaterialCommunityIcons', name: 'pasta' },
  indiana: { set: 'MaterialCommunityIcons', name: 'pot-mix' },
  chinesa: { set: 'MaterialCommunityIcons', name: 'pan' },
};
const DEFAULT_CUISINE_ICON: IconSpec = { set: 'Ionicons', name: 'restaurant-outline' };

type CuisineSelectorProps = {
  cuisines: (Cuisine & { isActive: boolean })[];
  onSelect: (id: string) => void;
};

export function CuisineSelector({ cuisines, onSelect }: CuisineSelectorProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 14, paddingHorizontal: 16, paddingVertical: 4 }}
    >
      {cuisines.map((cuisine) => (
        <Pressable key={cuisine.id} onPress={() => onSelect(cuisine.id)} className="items-center gap-1.5">
          <View
            className={`h-14 w-14 items-center justify-center rounded-full ${cuisine.isActive ? 'bg-[#eef2ff]' : 'bg-[#f3f4f6]'}`}
          >
            <Icon
              spec={CUISINE_ICONS[cuisine.id] ?? DEFAULT_CUISINE_ICON}
              size={22}
              color={cuisine.isActive ? '#4f46e5' : '#1f2937'}
            />
          </View>
          <Text className={`text-[11px] font-bold ${cuisine.isActive ? 'text-[#111827]' : 'text-[#6b7280]'}`}>
            {cuisine.label}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
