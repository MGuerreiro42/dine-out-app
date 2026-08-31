import { ScrollView, Text, View } from 'react-native';

import type { Highlight } from '@/features/restaurant/types';
import { spacing } from '@/theme';

type HighlightsRowProps = {
  highlights: Highlight[];
};

export function HighlightsRow({ highlights }: HighlightsRowProps) {
  if (highlights.length === 0) {
    return null;
  }

  return (
    <View className="py-md">
      <Text className="mb-sm2 px-md text-base font-bold text-ink">Highlights</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: spacing.sm2, paddingHorizontal: spacing.md }}
      >
        {highlights.map((highlight) => (
          <View key={highlight.id} className="w-[180px] rounded-lg border border-sand-border bg-white p-md">
            <Text className="text-sm font-bold text-ink">{highlight.title}</Text>
            <Text className="mt-xs text-xs leading-5 text-muted">{highlight.description}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
