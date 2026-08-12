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
            className={`h-11 w-11 items-center justify-center rounded-full ${occasion.isActive ? 'bg-[#eef2ff]' : 'bg-[#f3f4f6]'}`}
          >
            <Icon spec={occasion.icon} size={18} color={occasion.isActive ? '#4f46e5' : '#1f2937'} />
          </View>
          <Text className={`text-[13px] font-bold ${occasion.isActive ? 'text-[#111827]' : 'text-[#6b7280]'}`}>
            {occasion.label}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
