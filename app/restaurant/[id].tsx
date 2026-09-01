import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { BottomSheet, Icon, PhotoCarousel } from '@/components/ui';
import {
  ActionGrid,
  DetailHeaderActions,
  HighlightsRow,
  InfoActionsRow,
  InstagramSection,
  RedirectOptionsSheetContent,
  ReviewsSection,
  SimilarPlacesSection,
} from '@/features/restaurant/components';
import { useRestaurantDetailQuery } from '@/features/restaurant/api';
import { humanizeCategory } from '@/features/restaurant/lib/labels';
import { ReviewFormSheetContent } from '@/features/reviews/components';
import { useRestaurantsQuery } from '@/features/search/api';
import { formatDistanceKm, haversineKm } from '@/lib/geo';
import { useLocationStore } from '@/stores/location';
import { colors, iconSize } from '@/theme';

export default function RestaurantDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: restaurant, isLoading, isError, refetch } = useRestaurantDetailQuery(Number(id));
  const { data: allRestaurants } = useRestaurantsQuery();
  const fromLatitude = useLocationStore((s) => s.latitude);
  const fromLongitude = useLocationStore((s) => s.longitude);
  const [addressSheetOpen, setAddressSheetOpen] = useState(false);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center gap-sm2 bg-white px-xl">
        <Text className="text-center text-sm text-muted">Couldn't load restaurant.</Text>
        <Pressable onPress={() => refetch()} className="rounded-lg bg-ink px-md py-sm2">
          <Text className="text-sm font-bold text-white">Try again</Text>
        </Pressable>
      </View>
    );
  }

  if (!restaurant) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-sm text-muted">Restaurant not found.</Text>
      </View>
    );
  }

  const similarPlaces = (allRestaurants ?? [])
    .filter((r) => r.cuisine === restaurant.cuisine && r.id !== restaurant.id)
    .slice(0, 3);

  const hasRating = restaurant.rating !== null;
  const hasPrice = restaurant.priceLevel !== null;
  const hasAddress = restaurant.addressShort !== null;
  const hasInfoRow = hasRating || hasPrice || hasAddress;
  const alternateChips = restaurant.categoryAlternates.filter((category) => category !== restaurant.category);
  const distanceLabel = formatDistanceKm(
    haversineKm(fromLatitude, fromLongitude, restaurant.latitude, restaurant.longitude),
  );
  const breadcrumb = restaurant.categoryHierarchy.map(humanizeCategory);

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center gap-sm2 px-md pt-md">
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          className="h-10 w-10 items-center justify-center rounded-full bg-sand"
        >
          <Icon spec={{ set: 'Ionicons', name: 'chevron-back' }} size={iconSize.ui} color={colors.ink} />
        </Pressable>
        <View className="flex-1 flex-row items-center gap-sm rounded-full bg-sand px-md py-sm2">
          <Icon spec={{ set: 'Ionicons', name: 'search-outline' }} size={iconSize.inline} color={colors.inkFaint} />
          <TextInput
            editable={false}
            placeholder="Search restaurants..."
            placeholderTextColor={colors.inkFaint}
            className="flex-1 text-sm text-ink"
          />
        </View>
        <Pressable
          onPress={() => router.push('/profile')}
          className="h-10 w-10 items-center justify-center rounded-full bg-sand"
        >
          <Icon spec={{ set: 'Ionicons', name: 'person-outline' }} size={iconSize.ui} color={colors.ink} />
        </Pressable>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="mt-md">
          <PhotoCarousel photos={restaurant.photos} />
          <DetailHeaderActions restaurantId={restaurant.id} />
        </View>

        <View className="px-md pt-md">
          <Text className="text-2xl font-bold text-ink">{restaurant.name}</Text>

          {restaurant.brandName ? (
            <View className="mt-xs flex-row items-center gap-xs">
              <Icon spec={{ set: 'Ionicons', name: 'storefront-outline' }} size={iconSize.micro} color={colors.inkFaint} />
              <Text className="text-xs text-muted">Part of {restaurant.brandName}</Text>
            </View>
          ) : null}

          <View className="mt-sm2 flex-row items-center gap-xs self-start rounded-lg bg-sand px-sm2 py-xs">
            <Icon spec={{ set: 'Ionicons', name: 'location-outline' }} size={iconSize.micro} color={colors.ink} />
            <Text className="text-xs font-bold text-ink">{distanceLabel} from you</Text>
          </View>

          {breadcrumb.length > 0 ? (
            <Text className="mt-sm2 text-xs text-muted">{breadcrumb.join(' › ')}</Text>
          ) : null}

          <View className="mt-sm2 flex-row flex-wrap gap-sm">
            {restaurant.tags.map((tag) => (
              <View key={tag} className="rounded-full bg-accent-tint px-sm2 py-sm">
                <Text className="text-xs font-light text-accent">{tag}</Text>
              </View>
            ))}
          </View>

          <View className="mt-sm flex-row flex-wrap gap-sm">
            <View className="rounded-full border border-accent px-sm2 py-xs">
              <Text className="text-caption font-bold text-accent">{humanizeCategory(restaurant.category)}</Text>
            </View>
            {alternateChips.map((category) => (
              <View key={category} className="rounded-full border border-sand-border px-sm2 py-xs">
                <Text className="text-caption font-light text-muted">{humanizeCategory(category)}</Text>
              </View>
            ))}
          </View>
        </View>

        {hasInfoRow ? (
          <View className="mt-md flex-row flex-wrap items-center gap-x-sm gap-y-xs border-b border-sand-border px-md pb-md">
            {hasRating ? (
              <>
                <Icon spec={{ set: 'Ionicons', name: 'star' }} size={iconSize.inline} color={colors.rating} />
                <Text className="text-body font-bold text-ink">
                  {restaurant.rating}
                  {restaurant.reviewCount !== null ? ` (${restaurant.reviewCount})` : ''}
                </Text>
              </>
            ) : null}
            {hasRating && hasPrice ? <Text className="text-body text-muted">·</Text> : null}
            {hasPrice ? <Text className="text-body font-bold text-ink">{restaurant.priceLevel}</Text> : null}
            {(hasRating || hasPrice) && hasAddress ? <Text className="text-body text-muted">·</Text> : null}
            {hasAddress ? (
              <Pressable onPress={() => setAddressSheetOpen(true)} className="flex-row items-center gap-xs">
                <Icon spec={{ set: 'Ionicons', name: 'location-outline' }} size={iconSize.inline} color={colors.rating} />
                <Text className="text-body text-ink">{restaurant.addressShort}</Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}

        <ActionGrid menu={restaurant.menu} />

        <InfoActionsRow
          phones={restaurant.phones}
          whatsapp={restaurant.whatsapp}
          instagramHandle={restaurant.instagramHandle}
          websites={restaurant.websites}
          socialLinks={restaurant.socialLinks}
        />

        <ReviewsSection
          rating={restaurant.rating}
          reviews={restaurant.reviews}
          reviewCount={restaurant.reviewCount}
          onAddReview={() => setReviewFormOpen(true)}
        />

        <HighlightsRow highlights={restaurant.highlights} />

        <InstagramSection handle={restaurant.instagramHandle} />

        <SimilarPlacesSection
          similarPlaces={similarPlaces}
          onSelect={(similar) => router.replace(`/restaurant/${similar.id}`)}
        />
      </ScrollView>

      <BottomSheet visible={addressSheetOpen} onClose={() => setAddressSheetOpen(false)}>
        <RedirectOptionsSheetContent
          title="Address"
          options={[{ icon: { set: 'Ionicons', name: 'map-outline' }, label: 'Open in Google Maps' }]}
        />
      </BottomSheet>

      <BottomSheet visible={reviewFormOpen} onClose={() => setReviewFormOpen(false)}>
        <ReviewFormSheetContent restaurantId={restaurant.id} onSuccess={() => setReviewFormOpen(false)} />
      </BottomSheet>
    </View>
  );
}
