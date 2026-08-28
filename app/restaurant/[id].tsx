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
import { useRestaurantsQuery } from '@/features/search/api';

export default function RestaurantDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: restaurant, isLoading, isError, refetch } = useRestaurantDetailQuery(Number(id));
  const { data: allRestaurants } = useRestaurantsQuery();
  const [addressSheetOpen, setAddressSheetOpen] = useState(false);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center gap-3 bg-white px-8">
        <Text className="text-center text-sm text-muted">Couldn't load restaurant.</Text>
        <Pressable onPress={() => refetch()} className="rounded-xl bg-ink px-4 py-2.5">
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
  const categoryChips = Array.from(new Set([restaurant.category, ...restaurant.categoryAlternates]));

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center gap-2.5 px-4 pt-4">
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          className="h-10 w-10 items-center justify-center rounded-full bg-[#f3f4f6]"
        >
          <Icon spec={{ set: 'Ionicons', name: 'chevron-back' }} size={18} color="#1f2937" />
        </Pressable>
        <View className="flex-1 flex-row items-center gap-2 rounded-full bg-[#f3f4f6] px-4 py-3">
          <Icon spec={{ set: 'Ionicons', name: 'search-outline' }} size={16} color="#9ca3af" />
          <TextInput
            editable={false}
            placeholder="Search restaurants..."
            placeholderTextColor="#9ca3af"
            className="flex-1 text-sm text-[#111827]"
          />
        </View>
        <Pressable
          onPress={() => router.push('/profile')}
          className="h-10 w-10 items-center justify-center rounded-full bg-[#f3f4f6]"
        >
          <Icon spec={{ set: 'Ionicons', name: 'person-outline' }} size={18} color="#1f2937" />
        </Pressable>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="mt-3.5">
          <PhotoCarousel photos={restaurant.photos} />
          <DetailHeaderActions restaurantId={restaurant.id} />
        </View>

        <View className="px-4 pt-4">
          <Text className="text-2xl font-bold text-ink">{restaurant.name}</Text>

          {restaurant.brandName ? (
            <View className="mt-1 flex-row items-center gap-1">
              <Icon spec={{ set: 'Ionicons', name: 'storefront-outline' }} size={13} color="#8a8580" />
              <Text className="text-xs text-muted">Part of {restaurant.brandName}</Text>
            </View>
          ) : null}

          <View className="mt-2.5 flex-row flex-wrap gap-2">
            {restaurant.tags.map((tag) => (
              <View key={tag} className="rounded-full bg-[#e0e7ff] px-3 py-1.5">
                <Text className="text-xs font-light text-[#4338ca]">{tag}</Text>
              </View>
            ))}
          </View>

          <View className="mt-1.5 flex-row flex-wrap gap-1.5">
            {categoryChips.map((category) => (
              <View key={category} className="rounded-full border border-[#e5e7eb] px-2.5 py-1">
                <Text className="text-[11px] font-light text-muted">{humanizeCategory(category)}</Text>
              </View>
            ))}
          </View>
        </View>

        {hasInfoRow ? (
          <View className="mt-3.5 flex-row flex-wrap items-center gap-x-1.5 gap-y-1 border-b border-gray-100 px-4 pb-4">
            {hasRating ? (
              <>
                <Icon spec={{ set: 'Ionicons', name: 'star' }} size={14} color="#fbbf24" />
                <Text className="text-[15px] font-bold text-ink">
                  {restaurant.rating}
                  {restaurant.reviewCount !== null ? ` (${restaurant.reviewCount})` : ''}
                </Text>
              </>
            ) : null}
            {hasRating && hasPrice ? <Text className="text-[15px] text-muted">·</Text> : null}
            {hasPrice ? <Text className="text-[15px] font-bold text-ink">{restaurant.priceLevel}</Text> : null}
            {(hasRating || hasPrice) && hasAddress ? <Text className="text-[15px] text-muted">·</Text> : null}
            {hasAddress ? (
              <Pressable onPress={() => setAddressSheetOpen(true)} className="flex-row items-center gap-1">
                <Icon spec={{ set: 'Ionicons', name: 'location-outline' }} size={14} color="#fbbf24" />
                <Text className="text-[15px] text-ink">{restaurant.addressShort}</Text>
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

        <ReviewsSection rating={restaurant.rating} reviews={restaurant.reviews} reviewCount={restaurant.reviewCount} />

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
    </View>
  );
}
