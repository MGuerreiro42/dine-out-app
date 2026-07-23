import { Text } from 'react-native';

type RatingBadgeProps = {
  rating: string;
  priceLevel: string;
};

export function RatingBadge({ rating, priceLevel }: RatingBadgeProps) {
  return (
    <Text className="text-xs text-muted">
      ★ {rating} · {priceLevel}
    </Text>
  );
}
