import { Text, View } from 'react-native';

import type { ThingToKnow } from '@/features/restaurant/types';

type ThingsToKnowSectionProps = {
  thingsToKnow: ThingToKnow[];
};

export function ThingsToKnowSection({ thingsToKnow }: ThingsToKnowSectionProps) {
  return (
    <View className="border-t border-gray-100 px-4 py-5">
      <Text className="mb-3 text-base font-bold text-ink">Things to know</Text>
      <View className="gap-3.5">
        {thingsToKnow.map((item) => (
          <View key={item.title}>
            <Text className="mb-1 text-sm font-bold text-ink">{item.title}</Text>
            <Text className="text-[13px] leading-5 text-muted">{item.text}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
