import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';

import { BottomSheet } from '@/components/ui';
import { SearchBar } from '@/components/layout';
import { CategoryTabsRow, DiscoveryCard, SubtypeRow } from '@/features/search/components';
import { useCategoryDiscovery, useDebouncedValue } from '@/features/search/hooks';
import type { DiscoveryCardData } from '@/features/search/hooks';

export default function CategoryScreen() {
  const router = useRouter();
  const { cuisine } = useLocalSearchParams<{ cuisine?: string }>();
  const [searchText, setSearchText] = useState('');
  const debouncedSearchText = useDebouncedValue(searchText);
  const {
    isLoading,
    isError,
    refetch,
    cuisines,
    activeCuisineLabel,
    heroPhoto,
    subtypes,
    champions,
    trending,
    nearYou,
    setActiveCuisine,
  } = useCategoryDiscovery(cuisine, debouncedSearchText);
  const [viewMoreMessage, setViewMoreMessage] = useState<string | null>(null);

  const goToRestaurant = (restaurant: DiscoveryCardData) => {
    router.push(`/restaurant/${restaurant.id}`);
  };

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
        <Text className="text-center text-sm text-muted">Não foi possível carregar as categorias.</Text>
        <Pressable onPress={() => refetch()} className="rounded-xl bg-ink px-4 py-2.5">
          <Text className="text-sm font-bold text-white">Tentar de novo</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 24 }}>
      <View className="px-4 pt-4">
        <SearchBar value={searchText} onChangeText={setSearchText} />
        <View className="mt-3.5">
          <CategoryTabsRow cuisines={cuisines} onSelect={setActiveCuisine} />
        </View>
      </View>

      {heroPhoto ? (
        <View className="relative mx-4 mt-3.5 aspect-video overflow-hidden rounded-2xl">
          <Image source={{ uri: heroPhoto }} className="h-full w-full" />
          <View className="absolute inset-0 bg-black/30" />
          <View className="absolute bottom-4 left-4">
            <Text className="text-2xl font-bold text-white">{activeCuisineLabel}</Text>
          </View>
          <Pressable
            onPress={() => router.push('/search')}
            className="absolute bottom-4 right-3.5 rounded-full bg-white px-4 py-2"
          >
            <Text className="text-xs font-bold text-ink">View on map</Text>
          </Pressable>
        </View>
      ) : null}

      <View className="px-4 pt-5">
        <Text className="text-lg font-bold text-ink">
          The best rated <Text className="text-gold">{activeCuisineLabel}s</Text>
        </Text>
      </View>
      <View className="flex-row flex-wrap justify-between gap-y-3 px-4 pt-2.5">
        {champions.map((restaurant) => (
          <DiscoveryCard key={restaurant.id} restaurant={restaurant} onPress={goToRestaurant} />
        ))}
      </View>
      <View className="px-4 pb-1.5 pt-1">
        <Pressable onPress={() => setViewMoreMessage('Veja todos os melhores avaliados desta categoria.')}>
          <Text className="text-[13px] font-bold text-ink underline">view more</Text>
        </Pressable>
      </View>

      <SubtypeRow subtypes={subtypes} />

      <View className="border-t border-gray-100 px-4 pt-5">
        <Text className="text-lg font-bold text-ink">
          Trending <Text className="text-gold">Restaurants</Text>
        </Text>
      </View>
      <View className="flex-row flex-wrap justify-between gap-y-3 px-4 pt-2.5">
        {trending.map((restaurant) => (
          <DiscoveryCard key={restaurant.id} restaurant={restaurant} onPress={goToRestaurant} />
        ))}
      </View>
      <View className="px-4 pb-1.5 pt-1">
        <Pressable onPress={() => setViewMoreMessage('Veja todos os restaurantes em alta desta categoria.')}>
          <Text className="text-[13px] font-bold text-ink underline">view more</Text>
        </Pressable>
      </View>

      <View className="border-t border-gray-100 px-4 pt-5">
        <Text className="text-lg font-bold text-ink">
          {activeCuisineLabel}s <Text className="text-gold">Near You</Text>
        </Text>
      </View>
      <View className="flex-row flex-wrap justify-between gap-y-3 px-4 py-2.5">
        {nearYou.map((restaurant) => (
          <DiscoveryCard key={restaurant.id} restaurant={restaurant} onPress={goToRestaurant} />
        ))}
      </View>

      <BottomSheet visible={viewMoreMessage !== null} onClose={() => setViewMoreMessage(null)}>
        <Text className="text-center text-sm text-gray-600">{viewMoreMessage}</Text>
        <Pressable onPress={() => setViewMoreMessage(null)} className="mt-1.5 rounded-xl bg-ink p-3.5">
          <Text className="text-center text-sm font-bold text-white">Fechar</Text>
        </Pressable>
      </BottomSheet>
    </ScrollView>
  );
}
