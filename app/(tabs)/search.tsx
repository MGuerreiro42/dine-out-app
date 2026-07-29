import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';

import { MapResultCard, MapResultsSheet, MapSearchBar, SearchMapView } from '@/features/search/components';
import { useDebouncedValue, useSearchMapDiscovery } from '@/features/search/hooks';
import type { MapResultData } from '@/features/search/hooks';

export default function SearchScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const debouncedSearchText = useDebouncedValue(searchText);
  const { isLoading, isError, refetch, restaurants, results } = useSearchMapDiscovery(debouncedSearchText);
  // Falls back to the window height until onLayout reports the real
  // (slightly smaller, tab-bar-excluded) container size, so the sheet is
  // never zero-height/invisible even for the first render or if layout
  // measurement is ever delayed.
  const { height: windowHeight } = useWindowDimensions();
  const [containerHeight, setContainerHeight] = useState(windowHeight);

  const goToRestaurant = (restaurant: MapResultData | { id: number }) => {
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
        <Text className="text-center text-sm text-muted">Não foi possível carregar o mapa.</Text>
        <Pressable onPress={() => refetch()} className="rounded-xl bg-ink px-4 py-2.5">
          <Text className="text-sm font-bold text-white">Tentar de novo</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white" onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}>
      <View className="absolute bottom-0 left-0 right-0 top-0">
        <SearchMapView restaurants={restaurants} onSelectRestaurant={goToRestaurant} />
      </View>
      <MapSearchBar value={searchText} onChangeText={setSearchText} />
      <MapResultsSheet count={results.length} containerHeight={containerHeight}>
        <ScrollView contentContainerStyle={{ gap: 16 }} showsVerticalScrollIndicator={false}>
          {results.map((restaurant) => (
            <MapResultCard key={restaurant.id} restaurant={restaurant} onPress={goToRestaurant} />
          ))}
        </ScrollView>
      </MapResultsSheet>
    </View>
  );
}
