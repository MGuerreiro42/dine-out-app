import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';

import { colors, iconSize } from '@/theme';

type StarRatingInputProps = {
  value: number;
  onChange: (value: number) => void;
  size?: number;
  color?: string;
  count?: number;
};

export function StarRatingInput({
  value,
  onChange,
  size = iconSize.empty,
  color = colors.rating,
  count = 5,
}: StarRatingInputProps) {
  return (
    <View className="flex-row items-center gap-sm2">
      {Array.from({ length: count }, (_, index) => {
        const starValue = index + 1;
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length row of anonymous, non-reorderable stars — index is the only identity there is.
          <Pressable key={index} onPress={() => onChange(starValue)} hitSlop={6}>
            <Ionicons name={starValue <= value ? 'star' : 'star-outline'} size={size} color={color} />
          </Pressable>
        );
      })}
    </View>
  );
}
