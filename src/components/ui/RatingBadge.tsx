import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { colors, iconSize } from '@/theme';

type RatingBadgeProps = {
  rating: string | null;
  priceLevel: string | null;
};

export function RatingBadge({ rating, priceLevel }: RatingBadgeProps) {
  if (rating === null && priceLevel === null) {
    return null;
  }

  const label = [rating, priceLevel].filter((value): value is string => value !== null).join(' · ');

  return (
    <View className="flex-row items-center gap-xs">
      <Ionicons name="star" size={iconSize.micro} color={colors.inkFaint} />
      <Text className="text-xs text-muted">{label}</Text>
    </View>
  );
}
