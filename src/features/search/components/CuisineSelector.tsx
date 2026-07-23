import { Image, Pressable, ScrollView, Text, View } from 'react-native';

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
            className={`h-14 w-14 overflow-hidden rounded-full border-[3px] ${cuisine.isActive ? 'border-gold' : 'border-transparent'}`}
          >
            <Image source={{ uri: cuisine.photo }} className="h-full w-full" />
          </View>
          <Text className={`text-[11px] font-bold ${cuisine.isActive ? 'text-ink' : 'text-muted'}`}>
            {cuisine.label}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
