import { ScrollView, Text, View } from 'react-native';

import type { Highlight } from '@/features/restaurant/types';

type HighlightsRowProps = {
  highlights: Highlight[];
};

export function HighlightsRow({ highlights }: HighlightsRowProps) {
  if (highlights.length === 0) {
    return null;
  }

  return (
    <View className="py-4">
      <Text className="mb-3 px-4 text-base font-bold text-ink">Highlights</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, paddingHorizontal: 16 }}
      >
        {highlights.map((highlight) => (
          <View key={highlight.id} className="w-[180px] rounded-2xl border border-[#e5e7eb] bg-white p-3.5">
            <Text className="text-sm font-bold text-[#111827]">{highlight.title}</Text>
            <Text className="mt-1 text-xs leading-5 text-[#6b7280]">{highlight.description}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
