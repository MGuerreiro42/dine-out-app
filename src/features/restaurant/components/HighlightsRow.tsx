import { Text, View } from 'react-native';

type HighlightsRowProps = {
  highlights: string[];
};

export function HighlightsRow({ highlights }: HighlightsRowProps) {
  return (
    <View className="flex-row gap-2.5 px-4 py-4">
      {highlights.map((highlight) => (
        <View key={highlight} className="flex-1 items-center justify-center rounded-2xl bg-ink px-2 py-4">
          <Text className="text-center text-xs font-bold text-white">{highlight}</Text>
        </View>
      ))}
    </View>
  );
}
