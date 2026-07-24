import { Text, View } from 'react-native';

import type { OpeningHours } from '@/features/restaurant/types';

type OpeningHoursSheetContentProps = {
  openingHours: OpeningHours[];
};

export function OpeningHoursSheetContent({ openingHours }: OpeningHoursSheetContentProps) {
  return (
    <View>
      <Text className="mb-3.5 text-lg font-bold text-ink">Opening Hours</Text>
      {openingHours.map((entry) => (
        <View key={entry.day} className="flex-row justify-between border-b border-gray-100 py-2.5">
          <Text className="text-sm text-ink">{entry.day}</Text>
          <Text className="text-sm text-muted">{entry.hours}</Text>
        </View>
      ))}
    </View>
  );
}
