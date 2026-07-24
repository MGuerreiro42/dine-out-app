import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

import { BottomSheet, PhotoCarousel, RatingBadge } from '@/components/ui';
import { SearchBar } from '@/components/layout';
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
  ThingsToKnowSection,
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
        <Text className="text-center text-sm text-muted">Não foi possível carregar o restaurante.</Text>
        <Pressable onPress={() => refetch()} className="rounded-xl bg-ink px-4 py-2.5">
          <Text className="text-sm font-bold text-white">Tentar de novo</Text>
        </Pressable>
      </View>
    );
  }

  if (!restaurant) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-sm text-muted">Restaurante não encontrado.</Text>
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
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 24 }}>
      <View>
        <PhotoCarousel photos={restaurant.photos} />
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          className="absolute left-3.5 top-3.5 h-10 w-10 items-center justify-center rounded-full bg-black/45"
        >
          <Text className="text-xl leading-none text-white">‹</Text>
        </Pressable>
        <View className="absolute left-16 right-12 top-3.5">
          <SearchBar />
        </View>
        <DetailHeaderActions />
      </View>

      <View className="px-4 pt-4">
        <Text className="text-2xl font-bold text-ink">{restaurant.name}</Text>
        <Text className="mt-2 text-sm leading-6 text-gray-600">{descriptionText}</Text>
        {isDescriptionLong ? (
          <Pressable onPress={() => setDescriptionExpanded((expanded) => !expanded)}>
            <Text className="py-1 text-[13px] font-bold text-ink">
              {descriptionExpanded ? 'ver menos ▲' : 'ver mais ▼'}
            </Text>
          </Pressable>
        ) : null}

        <View className="mt-2.5 flex-row flex-wrap gap-2">
          {restaurant.tags.map((tag) => (
            <View key={tag} className="rounded-full bg-sand px-3 py-1.5">
              <Text className="text-xs font-bold text-ink">{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="mt-3.5 flex-row items-center justify-between border-b border-gray-100 px-4 pb-4">
        <Pressable onPress={() => setAddressSheetOpen(true)}>
          <Text className="text-[13px] text-ink">📍 {restaurant.addressShort}</Text>
        </Pressable>
        <Text className="text-[13px] font-bold text-ink">{restaurant.priceLevel}</Text>
        <RatingBadge rating={restaurant.rating} priceLevel={restaurant.priceLevel} />
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

      <ThingsToKnowSection thingsToKnow={restaurant.thingsToKnow} />

      <InstagramSection handle={restaurant.instagramHandle} photos={restaurant.instagramPhotos} />

      <SimilarPlacesSection
        similarPlaces={similarPlaces}
        onSelect={(similar) => router.replace(`/restaurant/${similar.id}`)}
      />

      <BottomSheet visible={addressSheetOpen} onClose={() => setAddressSheetOpen(false)}>
        <RedirectOptionsSheetContent title="Endereço" options={[{ icon: '🗺️', label: 'Abrir no Google Maps' }]} />
      </BottomSheet>
    </ScrollView>
  );
}
