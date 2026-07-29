import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

type StarRatingProps = {
  rating: number;
  size?: number;
  color?: string;
  count?: number;
};

// Shared by RatingBadge, DiscoveryCard, MapResultCard, and the restaurant
// feature's review sections — all previously duplicated a "★" text prefix or
// a `'★'.repeat(n)` string, neither of which works once stars are real icons.
export function StarRating({ rating, size = 12, color = '#f5a623', count = 5 }: StarRatingProps) {
  const filled = Math.round(rating);

  return (
    <View className="flex-row items-center gap-0.5">
      {Array.from({ length: count }, (_, index) => (
        <Ionicons key={index} name={index < filled ? 'star' : 'star-outline'} size={size} color={color} />
      ))}
    </View>
  );
}
