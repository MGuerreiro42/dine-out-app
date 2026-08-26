import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';

import { BottomSheet, Icon, StarRating } from '@/components/ui';
import type { Review } from '@/features/restaurant/types';

import { ReviewsSheetContent } from './ReviewsSheetContent';

const PREVIEW_COUNT = 3;

type ReviewsSectionProps = {
  rating: string | null;
  reviews: Review[];
  reviewCount: number | null;
};

export function ReviewsSection({ rating, reviews, reviewCount }: ReviewsSectionProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const preview = reviews.slice(0, PREVIEW_COUNT);

  if (preview.length === 0) {
    return (
      <View className="border-t border-gray-100 px-4 py-5">
        <Text className="mb-3 text-base font-bold text-ink">What Our Customers Think</Text>

        <View className="items-center gap-2 px-4 py-2">
          <Icon spec={{ set: 'Ionicons', name: 'chatbubble-ellipses-outline' }} size={32} color="#8a8580" />
          <Text className="text-center text-sm font-bold text-ink">No reviews yet</Text>
          <Text className="text-center text-xs text-muted">Be the first to share what you thought.</Text>
        </View>

        <Pressable
          onPress={() => Alert.alert('Coming soon', "Adding your own review isn't built yet.")}
          className="mt-3 items-center rounded-full border border-[#e5e7eb] py-3"
        >
          <Text className="text-[15px] font-light text-[#4f46e5]">Add a review</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="border-t border-gray-100 px-4 py-5">
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-base font-bold text-ink">What Our Customers Think</Text>
        <View className="flex-row items-center gap-1">
          <Ionicons name="star" size={13} color="#fbbf24" />
          <Text className="text-[15px] font-bold text-ink">{rating ?? '—'}</Text>
        </View>
      </View>

      <View className="gap-2.5">
        {preview.map((review) => (
          <View key={`${review.name}-${review.time}`} className="rounded-2xl bg-sand-light p-3.5">
            <View className="mb-1.5 flex-row items-center gap-2">
              <View className="h-8 w-8 items-center justify-center rounded-full bg-accent">
                <Text className="text-[15px] font-bold text-white">{review.name.charAt(0).toUpperCase()}</Text>
              </View>
              <View>
                <Text className="text-[15px] font-bold text-ink">{review.name}</Text>
                <Text className="text-[13px] text-muted">{review.time}</Text>
              </View>
            </View>
            <View className="mb-1.5">
              <StarRating rating={review.rating} size={13} color="#fbbf24" />
            </View>
            <Text className="text-[15px] leading-5 text-gray-600">{review.text}</Text>
          </View>
        ))}
      </View>

      <Pressable
        onPress={() => setSheetOpen(true)}
        className="mt-3 items-center rounded-full border border-[#e5e7eb] py-3"
      >
        <Text className="text-[15px] font-light text-[#4f46e5]">View all {reviewCount ?? 0} reviews</Text>
      </Pressable>

      <BottomSheet visible={sheetOpen} onClose={() => setSheetOpen(false)}>
        <ReviewsSheetContent reviews={reviews} />
      </BottomSheet>
    </View>
  );
}
