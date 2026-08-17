import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

type StarRatingProps = {
  rating: number;
  size?: number;
  color?: string;
  count?: number;
};

export function StarRating({ rating, size = 12, color = '#f5a623', count = 5 }: StarRatingProps) {
  const filled = Math.round(rating);

  return (
    <View className="flex-row items-center gap-0.5">
      {Array.from({ length: count }, (_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length row of anonymous, non-reorderable stars — index is the only identity there is.
        <Ionicons key={index} name={index < filled ? 'star' : 'star-outline'} size={size} color={color} />
      ))}
    </View>
  );
}
