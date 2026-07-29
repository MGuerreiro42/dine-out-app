import { Text, View } from 'react-native';

import { Icon } from '@/components/ui';
import type { Amenity } from '@/features/restaurant/types';

type AmenitiesSheetContentProps = {
  amenities: Amenity[];
};

export function AmenitiesSheetContent({ amenities }: AmenitiesSheetContentProps) {
  return (
    <View>
      <Text className="mb-3.5 text-lg font-bold text-ink">Amenities</Text>
      <View className="gap-3">
        {amenities.map((amenity) => (
          <View key={amenity.label} className="flex-row items-center gap-2.5">
            <Icon spec={amenity.icon} size={18} />
            <Text className="text-sm text-ink">{amenity.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
