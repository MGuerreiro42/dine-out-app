import { Text, View } from 'react-native';

import type { Benefit } from '@/features/search/types';

type BenefitsGridProps = {
  benefits: Benefit[];
};

export function BenefitsGrid({ benefits }: BenefitsGridProps) {
  return (
    <View className="flex-row flex-wrap gap-2.5 px-4 py-5">
      {benefits.map((benefit) => (
        <View key={benefit.text} className="w-[47%] rounded-2xl bg-sand-light p-3">
          <View className="mb-2 h-[3px] w-4 bg-gold" />
          <Text className="text-xs font-bold text-ink">{benefit.text}</Text>
        </View>
      ))}
    </View>
  );
}
