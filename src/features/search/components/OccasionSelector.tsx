import { Pressable, ScrollView, Text, View } from 'react-native';

import { Icon } from '@/components/ui';
import type { Occasion } from '@/features/search/types';

type OccasionSelectorProps = {
  occasions: (Occasion & { isActive: boolean })[];
  onSelect: (id: string) => void;
};

export function OccasionSelector({ occasions, onSelect }: OccasionSelectorProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 16, paddingHorizontal: 16, paddingVertical: 4 }}
    >
      {occasions.map((occasion) => (
        <Pressable key={occasion.id} onPress={() => onSelect(occasion.id)} className="items-center gap-1.5">
          <View
            className={`h-[52px] w-[52px] items-center justify-center rounded-2xl ${occasion.isActive ? 'bg-ink' : 'bg-sand'}`}
          >
            <Icon spec={occasion.icon} size={22} color={occasion.isActive ? '#c9a24b' : '#161311'} />
          </View>
          <Text className={`text-[11px] font-bold ${occasion.isActive ? 'text-ink' : 'text-muted'}`}>
            {occasion.label}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
