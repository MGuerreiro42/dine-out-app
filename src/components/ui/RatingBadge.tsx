import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

type RatingBadgeProps = {
  rating: string;
  priceLevel: string;
};

export function RatingBadge({ rating, priceLevel }: RatingBadgeProps) {
  return (
    <View className="flex-row items-center gap-1">
      <Ionicons name="star" size={11} color="#8a8580" />
      <Text className="text-xs text-muted">
        {rating} · {priceLevel}
      </Text>
    </View>
  );
}
