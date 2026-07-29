import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { BottomSheet, StarRating } from '@/components/ui';
import type { Review } from '@/features/restaurant/types';

import { ReviewsSheetContent } from './ReviewsSheetContent';

type ReviewsSectionProps = {
  rating: string;
  reviews: Review[];
  reviewCount: number;
};

export function ReviewsSection({ rating, reviews, reviewCount }: ReviewsSectionProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const preview = reviews[0];

  if (!preview) {
    return null;
  }

  return (
    <View className="border-t border-gray-100 px-4 py-5">
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-base font-bold text-ink">What Our Customers Think</Text>
        <View className="flex-row items-center gap-1">
          <Ionicons name="star" size={13} color="#161311" />
          <Text className="text-[13px] font-bold text-ink">{rating}</Text>
        </View>
      </View>

      <View className="rounded-2xl bg-sand-light p-3.5">
        <View className="mb-1.5 flex-row items-center gap-2">
          <View className="h-8 w-8 items-center justify-center rounded-full bg-gold">
            <Text className="text-[13px] font-bold text-white">{preview.name.charAt(0).toUpperCase()}</Text>
          </View>
          <View>
            <Text className="text-[13px] font-bold text-ink">{preview.name}</Text>
            <Text className="text-[11px] text-muted">{preview.time}</Text>
          </View>
        </View>
        <View className="mb-1.5">
          <StarRating rating={preview.rating} size={13} color="#c9a24b" />
        </View>
        <Text className="text-[13px] leading-5 text-gray-600">{preview.text}</Text>
      </View>

      <Pressable onPress={() => setSheetOpen(true)} className="mt-2.5 self-start">
        <Text className="text-[13px] font-bold text-ink underline">view all {reviewCount} reviews</Text>
      </Pressable>

      <BottomSheet visible={sheetOpen} onClose={() => setSheetOpen(false)}>
        <ReviewsSheetContent reviews={reviews} />
      </BottomSheet>
    </View>
  );
}
