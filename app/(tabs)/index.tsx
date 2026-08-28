import { useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

import { SideMenu } from '@/components/layout';
import { EmptyState, Icon } from '@/components/ui';
import {
  CuisineSelector,
  FeaturedBanner,
  HomeSkeleton,
  LocationHeader,
  RADIUS_OPTIONS_KM,
  RestaurantSection,
} from '@/features/search/components';
import { useHomeDiscovery } from '@/features/search/hooks';
import { useLocationStore } from '@/stores/location';
import type { Restaurant } from '@/types';

const MAX_RADIUS_KM = Math.max(...RADIUS_OPTIONS_KM);

export default function HomeScreen() {
  const router = useRouter();
  const {
    isLoading,
    isFetching,
    isError,
    refetch,
    restaurants,
    cuisines,
    cuisineList,
    spotlights,
    featured,
    taglineFor,
    setActiveCuisine,
  } = useHomeDiscovery();
  const radiusKm = useLocationStore((s) => s.radiusKm);
  const setRadiusKm = useLocationStore((s) => s.setRadiusKm);
  const activeCuisine = cuisines.find((c) => c.isActive);
  const deliveryList = restaurants.filter((r) => r.hasDelivery);

  const goToRestaurant = (restaurant: Restaurant) => {
    router.push(`/restaurant/${restaurant.id}`);
  };

  const searchBarHeader = (
    <View className="flex-row items-center gap-2.5 px-4 pt-4">
      <Pressable
        onPress={() => router.push('/search')}
        className="flex-1 flex-row items-center gap-2 rounded-full bg-[#f3f4f6] px-4 py-3"
      >
        <Icon spec={{ set: 'Ionicons', name: 'search-outline' }} size={16} color="#9ca3af" />
        <Text className="text-sm text-[#9ca3af]">Search restaurants...</Text>
      </Pressable>
      <SideMenu />
    </View>
  );

  if (isLoading) {
    return (
      <View className="flex-1 bg-white">
        {searchBarHeader}
        <HomeSkeleton />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center gap-3 bg-white px-8">
        <Text className="text-center text-sm text-muted">Couldn't load Home.</Text>
        <Pressable onPress={() => refetch()} className="rounded-xl bg-ink px-4 py-2.5">
          <Text className="text-sm font-bold text-white">Try again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {searchBarHeader}

      <LocationHeader />

      {restaurants.length === 0 && isFetching ? (
        <View className="flex-1 items-center justify-center gap-2 px-8">
          <ActivityIndicator />
          <Text className="text-center text-sm text-muted">Searching a wider area...</Text>
        </View>
      ) : restaurants.length === 0 && radiusKm >= MAX_RADIUS_KM ? (
        <EmptyState
          icon={{ set: 'Ionicons', name: 'restaurant-outline' }}
          title={`No restaurants found within ${MAX_RADIUS_KM} km`}
          subtitle="Try a different location."
        />
      ) : restaurants.length === 0 ? (
        <EmptyState
          icon={{ set: 'Ionicons', name: 'restaurant-outline' }}
          title="No restaurants found near you"
          subtitle="Try expanding your search radius."
          cta={{ label: `Expand to ${MAX_RADIUS_KM} km`, onPress: () => setRadiusKm(MAX_RADIUS_KM) }}
        />
      ) : (
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
          {featured.length ? <FeaturedBanner restaurants={featured} taglineFor={taglineFor} /> : null}

          <View className="flex-row items-center justify-between px-4 pb-2 pt-6">
            <View className="flex-row items-center gap-1.5">
              <Icon spec={{ set: 'Ionicons', name: 'restaurant-outline' }} size={16} color="#4f46e5" />
              <Text className="text-[17px] font-bold text-[#111827]">Choose your Cuisine</Text>
            </View>
            <Pressable onPress={() => router.push('/type-overview/cuisine')}>
              <Text className="text-xs font-normal text-[#4f46e5]">View all cuisines</Text>
            </Pressable>
          </View>
          <CuisineSelector cuisines={cuisines} onSelect={setActiveCuisine} />
          <RestaurantSection
            restaurants={cuisineList}
            onSelectRestaurant={goToRestaurant}
            viewMoreLabel="View more"
            onViewMore={() => {
              if (activeCuisine) router.push(`/type/cuisine/${activeCuisine.id}`);
            }}
          />

          {spotlights.map((spotlight, index) => (
            <View key={spotlight.cuisineId}>
              <View className="flex-row items-center justify-between px-4 pb-2 pt-6">
                <View className="flex-row items-center gap-1.5">
                  <Icon
                    spec={{ set: 'Ionicons', name: index === 0 ? 'flame-outline' : 'trending-up-outline' }}
                    size={16}
                    color="#4f46e5"
                  />
                  <Text className="text-[17px] font-bold text-[#111827]">{spotlight.title}</Text>
                </View>
                <Pressable onPress={() => router.push(`/type/cuisine/${spotlight.cuisineId}`)}>
                  <Text className="text-xs font-normal text-[#4f46e5]">View more</Text>
                </Pressable>
              </View>
              <RestaurantSection
                restaurants={spotlight.restaurants}
                onSelectRestaurant={goToRestaurant}
                viewMoreLabel="View more"
                onViewMore={() => router.push(`/type/cuisine/${spotlight.cuisineId}`)}
              />
            </View>
          ))}

          <View className="flex-row items-center justify-between px-4 pb-2 pt-6">
            <View className="flex-row items-center gap-1.5">
              <Icon spec={{ set: 'Ionicons', name: 'bag-outline' }} size={16} color="#4f46e5" />
              <Text className="text-[17px] font-bold text-[#111827]">Best Deliveries & Takeaways</Text>
            </View>
            <Pressable onPress={() => router.push({ pathname: '/search', params: { delivery: '1' } })}>
              <Text className="text-xs font-normal text-[#4f46e5]">View all</Text>
            </Pressable>
          </View>
          <RestaurantSection
            restaurants={deliveryList}
            onSelectRestaurant={goToRestaurant}
            viewMoreLabel="View more"
            onViewMore={() => router.push({ pathname: '/search', params: { delivery: '1' } })}
          />
        </ScrollView>
      )}
    </View>
  );
}
