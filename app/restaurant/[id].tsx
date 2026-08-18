import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { BottomSheet, Icon, PhotoCarousel } from '@/components/ui';
import {
  ActionGrid,
  AmenitiesSection,
  DetailHeaderActions,
  HighlightsRow,
  InfoActionsRow,
  InstagramSection,
  RedirectOptionsSheetContent,
  ReviewsSection,
  SimilarPlacesSection,
} from '@/features/restaurant/components';
import { useRestaurantDetailQuery } from '@/features/restaurant/api';
import { useRestaurantsQuery } from '@/features/search/api';

const DESCRIPTION_TRUNCATE_LENGTH = 110;

export default function RestaurantDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: restaurant, isLoading, isError, refetch } = useRestaurantDetailQuery(Number(id));
  const { data: allRestaurants } = useRestaurantsQuery();
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
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

  const isDescriptionLong = restaurant.description.length > DESCRIPTION_TRUNCATE_LENGTH;
  const descriptionText =
    descriptionExpanded || !isDescriptionLong
      ? restaurant.description
      : `${restaurant.description.slice(0, DESCRIPTION_TRUNCATE_LENGTH)}...`;

  const similarPlaces = (allRestaurants ?? [])
    .filter((r) => r.cuisine === restaurant.cuisine && r.id !== restaurant.id)
    .slice(0, 3);

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
          <Text className="mt-2 text-sm leading-6 text-gray-600">{descriptionText}</Text>
          {isDescriptionLong ? (
            <Pressable
              onPress={() => setDescriptionExpanded((expanded) => !expanded)}
              className="flex-row items-center gap-1 py-1"
            >
              <Text className="text-[15px] font-bold text-ink">{descriptionExpanded ? 'show less' : 'show more'}</Text>
              <Icon spec={{ set: 'Ionicons', name: descriptionExpanded ? 'chevron-up' : 'chevron-down' }} size={14} />
            </Pressable>
          ) : null}

          <View className="mt-2.5 flex-row flex-wrap gap-2">
            {restaurant.tags.map((tag) => (
              <View key={tag} className="rounded-full bg-[#e0e7ff] px-3 py-1.5">
                <Text className="text-xs font-light text-[#4338ca]">{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="mt-3.5 flex-row flex-wrap items-center gap-x-1.5 gap-y-1 border-b border-gray-100 px-4 pb-4">
          <Icon spec={{ set: 'Ionicons', name: 'star' }} size={14} color="#fbbf24" />
          <Text className="text-[15px] font-bold text-ink">
            {restaurant.rating} ({restaurant.reviewCount})
          </Text>
          <Text className="text-[15px] text-muted">·</Text>
          <Text className="text-[15px] font-bold text-ink">{restaurant.priceLevel}</Text>
          <Text className="text-[15px] text-muted">·</Text>
          <Pressable onPress={() => setAddressSheetOpen(true)} className="flex-row items-center gap-1">
            <Icon spec={{ set: 'Ionicons', name: 'location-outline' }} size={14} color="#fbbf24" />
            <Text className="text-[15px] text-ink">{restaurant.addressShort}</Text>
          </Pressable>
        </View>

        <ActionGrid menu={restaurant.menu} />

        <InfoActionsRow
          phone={restaurant.phone}
          whatsapp={restaurant.whatsapp}
          instagramHandle={restaurant.instagramHandle}
          openingHours={restaurant.openingHours}
        />

        <AmenitiesSection amenities={restaurant.amenities} />

        <ReviewsSection rating={restaurant.rating} reviews={restaurant.reviews} reviewCount={restaurant.reviewCount} />

        <HighlightsRow highlights={restaurant.highlights} />

        <InstagramSection handle={restaurant.instagramHandle} photos={restaurant.instagramPhotos} />

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
