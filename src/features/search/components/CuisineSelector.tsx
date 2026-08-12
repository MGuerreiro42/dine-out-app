import { Pressable, ScrollView, Text, View } from 'react-native';

import { Icon } from '@/components/ui';
import { CUISINE_ICONS, DEFAULT_CUISINE_ICON } from '@/features/search/lib/taxonomyIcons';
import type { Cuisine } from '@/features/search/types';

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
            className={`h-11 w-11 items-center justify-center rounded-full ${cuisine.isActive ? 'bg-[#eef2ff]' : 'bg-[#f3f4f6]'}`}
          >
            <Icon
              spec={CUISINE_ICONS[cuisine.id] ?? DEFAULT_CUISINE_ICON}
              size={18}
              color={cuisine.isActive ? '#4f46e5' : '#1f2937'}
            />
          </View>
          <Text className={`text-[13px] font-bold ${cuisine.isActive ? 'text-[#111827]' : 'text-[#6b7280]'}`}>
            {cuisine.label}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
