import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { BottomSheet, Icon } from '@/components/ui';
import type { Amenity } from '@/features/restaurant/types';

import { AmenitiesSheetContent } from './AmenitiesSheetContent';

const PREVIEW_COUNT = 5;

type AmenitiesSectionProps = {
  amenities: Amenity[];
};

export function AmenitiesSection({ amenities }: AmenitiesSectionProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const preview = amenities.slice(0, PREVIEW_COUNT);

  return (
    <View className="border-t border-gray-100 px-4 py-5">
      <Text className="mb-3 text-base font-bold text-ink">What this place offers</Text>
      <View className="flex-row flex-wrap gap-2">
        {preview.map((amenity) => (
          <View
            key={amenity.label}
            className="flex-row items-center gap-1.5 rounded-full border border-[#e5e7eb] px-3.5 py-2"
          >
            <Icon spec={amenity.icon} size={15} color="#4f46e5" />
            <Text className="text-[15px] font-light text-[#1f2937]">{amenity.label}</Text>
          </View>
        ))}
      </View>
      {amenities.length > PREVIEW_COUNT ? (
        <Pressable
          onPress={() => setSheetOpen(true)}
          className="mt-3 self-start rounded-full border border-[#e5e7eb] px-4 py-2.5"
        >
          <Text className="text-[15px] font-light text-[#1f2937]">Show all {amenities.length} amenities</Text>
        </Pressable>
      ) : null}

      <BottomSheet visible={sheetOpen} onClose={() => setSheetOpen(false)}>
        <AmenitiesSheetContent amenities={amenities} />
      </BottomSheet>
    </View>
  );
}
