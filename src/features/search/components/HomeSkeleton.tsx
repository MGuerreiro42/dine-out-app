import { View } from 'react-native';

import { Skeleton } from '@/components/ui';

const CHIP_COUNT = 5;
const CARD_COUNT = 3;
const SECTION_COUNT = 4;

const CHIP_KEYS = Array.from({ length: CHIP_COUNT }, (_, index) => `chip-${index}`);
const CARD_KEYS = Array.from({ length: CARD_COUNT }, (_, index) => `card-${index}`);
const SECTION_KEYS = Array.from({ length: SECTION_COUNT }, (_, index) => `section-${index}`);

function SkeletonChipRow() {
  return (
    <View className="mt-6 flex-row gap-3.5 px-4">
      {CHIP_KEYS.map((key) => (
        <Skeleton key={key} className="h-11 w-11 rounded-full" />
      ))}
    </View>
  );
}

function SkeletonSection() {
  return (
    <View className="mt-6 gap-3 px-4">
      <Skeleton className="h-4 w-40 rounded" />
      <View className="flex-row gap-3">
        {CARD_KEYS.map((key) => (
          <Skeleton key={key} className="aspect-[4/3] w-[130px] rounded-xl" />
        ))}
      </View>
    </View>
  );
}

export function HomeSkeleton() {
  return (
    <View className="flex-1">
      <Skeleton className="mx-4 mt-1.5 aspect-[16/7] rounded-2xl" />
      <SkeletonChipRow />
      {SECTION_KEYS.map((key) => (
        <SkeletonSection key={key} />
      ))}
    </View>
  );
}
