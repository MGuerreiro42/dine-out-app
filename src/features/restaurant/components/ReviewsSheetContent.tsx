import { Text, View } from 'react-native';

import { StarRating } from '@/components/ui';
import type { Review } from '@/features/restaurant/types';

type ReviewsSheetContentProps = {
  reviews: Review[];
};

export function ReviewsSheetContent({ reviews }: ReviewsSheetContentProps) {
  return (
    <View>
      <Text className="mb-3.5 text-lg font-bold text-ink">Reviews</Text>
      <View className="gap-4">
        {reviews.map((review) => (
          <View key={`${review.name}-${review.time}`} className="border-b border-gray-100 pb-4">
            <View className="mb-1.5 flex-row items-center gap-2">
              <View className="h-8 w-8 items-center justify-center rounded-full bg-gold">
                <Text className="text-[13px] font-bold text-white">{review.name.charAt(0).toUpperCase()}</Text>
              </View>
              <View>
                <Text className="text-[13px] font-bold text-ink">{review.name}</Text>
                <Text className="text-[11px] text-muted">{review.time}</Text>
              </View>
            </View>
            <View className="mb-1.5">
              <StarRating rating={review.rating} size={13} color="#c9a24b" />
            </View>
            <Text className="text-[13px] leading-5 text-gray-600">{review.text}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
