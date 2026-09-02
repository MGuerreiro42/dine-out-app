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
    <View className="mt-lg flex-row gap-md px-md">
      {CHIP_KEYS.map((key) => (
        <Skeleton key={key} className="h-11 w-11 rounded-full" />
      ))}
    </View>
  );
}

export function SkeletonSection() {
  return (
    <View className="mt-lg gap-sm2 px-md">
      <Skeleton className="h-4 w-40 rounded" />
      <View className="flex-row gap-sm2">
        {CARD_KEYS.map((key) => (
          <Skeleton key={key} className="aspect-[4/3] w-[130px] rounded-lg" />
        ))}
      </View>
    </View>
  );
}

export function HomeSkeleton() {
  return (
    <View className="flex-1">
      <Skeleton className="mx-md mt-sm aspect-[16/7] rounded-lg" />
      <SkeletonChipRow />
      {SECTION_KEYS.map((key) => (
        <SkeletonSection key={key} />
      ))}
    </View>
  );
}
