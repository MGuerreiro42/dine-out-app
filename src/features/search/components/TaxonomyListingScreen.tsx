import { type Href, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';

import { BottomSheet, Icon } from '@/components/ui';
import { SearchBar } from '@/components/layout';
import { CategoryTabsRow } from '@/features/search/components/CategoryTabsRow';
import { DiscoveryCard } from '@/features/search/components/DiscoveryCard';
import { SubtypeRow } from '@/features/search/components/SubtypeRow';
import { useTaxonomyDiscovery, useDebouncedValue } from '@/features/search/hooks';
import type { DiscoveryCardData, TaxonomyDimension } from '@/features/search/hooks';

type HeadingParts = { prefix?: string; highlighted: string; suffix?: string };

type TaxonomyListingScreenProps = {
  dimension: TaxonomyDimension;
  initialId?: string;
  bestRatedHeading: (label: string) => HeadingParts;
  nearYouHeading: (label: string) => HeadingParts;
  fallbackBackRoute: string;
};

function Heading({ parts }: { parts: HeadingParts }) {
  return (
    <Text className="text-lg font-bold text-ink">
      {parts.prefix}
      <Text className="text-gold">{parts.highlighted}</Text>
      {parts.suffix}
    </Text>
  );
}

/**
 * Generic "browse restaurants grouped by one taxonomy dimension" screen —
 * hero banner, in-page tabs, best-rated/trending/near-you grids. Backs both
 * the per-cuisine Category page and the Dine-in/Bars/Takeout venue-type
 * listing; only wording (via the heading props) and whether a subtype row
 * renders differ between dimensions, everything else is shared.
 */
export function TaxonomyListingScreen({
  dimension,
  initialId,
  bestRatedHeading,
  nearYouHeading,
  fallbackBackRoute,
}: TaxonomyListingScreenProps) {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const debouncedSearchText = useDebouncedValue(searchText);
  const {
    isLoading,
    isError,
    refetch,
    items,
    activeLabel,
    heroPhoto,
    subtypes,
    champions,
    trending,
    nearYou,
    setActiveId,
  } = useTaxonomyDiscovery(dimension, initialId, debouncedSearchText);
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
          <CategoryTabsRow items={items} onSelect={setActiveId} />
        </View>
      </View>

      {heroPhoto ? (
        <View className="relative mx-4 mt-3.5 aspect-video overflow-hidden rounded-2xl">
          <Image source={{ uri: heroPhoto }} className="h-full w-full" />
          <View className="absolute inset-0 bg-black/30" />
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace(fallbackBackRoute as Href))}
            className="absolute left-3.5 top-3.5 h-10 w-10 items-center justify-center rounded-full bg-black/45"
          >
            <Icon spec={{ set: 'Ionicons', name: 'chevron-back' }} size={20} color="#fff" />
          </Pressable>
          <View className="absolute bottom-4 left-4">
            <Text className="text-2xl font-bold text-white">{activeLabel}</Text>
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
        <Heading parts={bestRatedHeading(activeLabel)} />
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

      {subtypes.length > 0 ? <SubtypeRow subtypes={subtypes} /> : null}

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
        <Heading parts={nearYouHeading(activeLabel)} />
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
