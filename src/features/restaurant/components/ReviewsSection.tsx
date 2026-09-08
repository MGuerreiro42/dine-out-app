import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';

import { BottomSheet, Icon, StarRating } from '@/components/ui';
import type { Review } from '@/features/restaurant/types';
import { useAuthStore } from '@/stores/auth';
import { colors, iconSize } from '@/theme';

import { ReviewsSheetContent } from './ReviewsSheetContent';

const PREVIEW_COUNT = 3;

type ReviewsSectionProps = {
  rating: string | null;
  reviews: Review[];
  reviewCount: number | null;
  onAddReview: () => void;
};

export function ReviewsSection({ rating, reviews, reviewCount, onAddReview }: ReviewsSectionProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const preview = reviews.slice(0, PREVIEW_COUNT);

  const handleAddReview = () => {
    if (!useAuthStore.getState().isLoggedIn) {
      Alert.alert('Log in to leave a review', 'Create an account or log in to review restaurants.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log in', onPress: () => router.push('/login') },
      ]);
      return;
    }
    onAddReview();
  };

  if (preview.length === 0) {
    return (
      <View className="border-t border-sand-border px-md py-md2">
        <Text className="mb-sm2 text-base font-bold text-ink">What Our Customers Think</Text>

        <View className="items-center gap-sm px-md py-sm">
          <Icon
            spec={{ set: 'Ionicons', name: 'chatbubble-ellipses-outline' }}
            size={iconSize.empty}
            color={colors.inkFaint}
          />
          <Text className="text-center text-sm font-bold text-ink">No reviews yet</Text>
          <Text className="text-center text-xs text-muted">Be the first to share what you thought.</Text>
        </View>

        <Pressable
          onPress={handleAddReview}
          className="mt-sm2 items-center rounded-full border border-sand-border py-sm2"
        >
          <Text className="text-body font-light text-accent">Add a review</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="border-t border-sand-border px-md py-md2">
      <View className="mb-sm2 flex-row items-center justify-between">
        <Text className="text-base font-bold text-ink">What Our Customers Think</Text>
        <View className="flex-row items-center gap-xs">
          <Ionicons name="star" size={iconSize.micro} color={colors.rating} />
          <Text className="text-body font-bold text-ink">{rating ?? '—'}</Text>
        </View>
      </View>

      <View className="gap-sm2">
        {preview.map((review) => (
          <View key={review.id} className="rounded-lg bg-sand-light p-md">
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

      <View className="mt-sm2 flex-row gap-sm">
        <Pressable
          onPress={() => setSheetOpen(true)}
          className="flex-1 items-center rounded-full border border-sand-border py-sm2"
        >
          <Text className="text-body font-light text-accent">View all {reviewCount ?? 0} reviews</Text>
        </Pressable>
        <Pressable
          onPress={handleAddReview}
          className="flex-1 items-center rounded-full border border-sand-border py-sm2"
        >
          <Text className="text-body font-light text-accent">Add a review</Text>
        </Pressable>
      </View>

      <BottomSheet visible={sheetOpen} onClose={() => setSheetOpen(false)}>
        <ReviewsSheetContent reviews={reviews} />
      </BottomSheet>
    </View>
  );
}
