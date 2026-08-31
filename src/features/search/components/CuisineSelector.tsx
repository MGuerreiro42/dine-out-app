import { Pressable, ScrollView, Text, View } from 'react-native';

import { Icon } from '@/components/ui';
import { CUISINE_ICONS, DEFAULT_CUISINE_ICON } from '@/features/search/lib/taxonomyIcons';
import type { Cuisine } from '@/features/search/types';
import { colors, iconSize } from '@/theme';

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
        <Pressable key={cuisine.id} onPress={() => onSelect(cuisine.id)} className="w-16 items-center gap-sm">
          <View
            className={`h-11 w-11 items-center justify-center rounded-full ${cuisine.isActive ? 'bg-accent-tint' : 'bg-sand'}`}
          >
            <Icon
              spec={CUISINE_ICONS[cuisine.id] ?? DEFAULT_CUISINE_ICON}
              size={iconSize.ui}
              color={cuisine.isActive ? colors.accent : colors.ink}
            />
          </View>
          <Text className={`text-center text-caption font-bold ${cuisine.isActive ? 'text-ink' : 'text-muted'}`}>
            {cuisine.label}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
