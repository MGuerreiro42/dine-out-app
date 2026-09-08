import { Text, View } from 'react-native';

import { StarRating } from '@/components/ui';
import type { Review } from '@/features/restaurant/types';
import { colors, iconSize } from '@/theme';

type ReviewsSheetContentProps = {
  reviews: Review[];
};

export function ReviewsSheetContent({ reviews }: ReviewsSheetContentProps) {
  return (
    <View>
      <Text className="mb-md text-lg font-bold text-ink">Reviews</Text>
      <View className="gap-md">
        {reviews.map((review) => (
          <View key={review.id} className="border-b border-sand-border pb-md">
            <View className="mb-sm flex-row items-center gap-sm">
              <View className="h-8 w-8 items-center justify-center rounded-full bg-accent">
                <Text className="text-body font-bold text-white">{review.userName.charAt(0).toUpperCase()}</Text>
              </View>
              <View>
                <Text className="text-body font-bold text-ink">{review.userName}</Text>
                <Text className="text-caption text-muted">{new Date(review.createdAt).toLocaleDateString()}</Text>
              </View>
            </View>
            <View className="mb-sm">
              <StarRating rating={review.rating} size={iconSize.micro} color={colors.rating} />
            </View>
            <Text className="text-body leading-5 text-ink-muted">{review.text}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
