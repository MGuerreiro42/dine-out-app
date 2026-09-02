import { useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

import { SideMenu } from '@/components/layout';
import { Chip, EmptyState, Icon } from '@/components/ui';
import {
  BrandRail,
  CuisineSelector,
  FeaturedBanner,
  HomeSkeleton,
  LocationHeader,
  NearbySection,
  RADIUS_OPTIONS_KM,
  RestaurantSection,
  SkeletonSection,
} from '@/features/search/components';
import { useHomeDiscovery } from '@/features/search/hooks';
import { useLocationStore } from '@/stores/location';
import { colors, iconSize } from '@/theme';
import type { Restaurant } from '@/types';

const MAX_RADIUS_KM = Math.max(...RADIUS_OPTIONS_KM);

// Occasion data isn't enriched enough yet to make this section useful — hidden, not
// deleted, until that changes.
const SHOW_EXPLORE_BY_TYPE = false;

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
    cuisineListLoading,
    occasions,
    spotlights,
    featured,
    brandRestaurants,
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
    <View className="flex-row items-center gap-sm2 px-md pt-md">
      <Pressable
        onPress={() => router.push('/search')}
        className="flex-1 flex-row items-center gap-sm rounded-full bg-sand px-md py-sm2"
      >
        <Icon spec={{ set: 'Ionicons', name: 'search-outline' }} size={iconSize.inline} color={colors.inkFaint} />
        <Text className="text-sm text-muted">Search restaurants...</Text>
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
      <View className="flex-1 items-center justify-center gap-sm2 bg-white px-xl">
        <Text className="text-center text-sm text-muted">Couldn't load Home.</Text>
        <Pressable onPress={() => refetch()} className="rounded-lg bg-ink px-md py-sm2">
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
        <View className="flex-1 items-center justify-center gap-sm px-xl">
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

          <View className="flex-row items-center justify-between px-md pb-sm pt-lg">
            <View className="flex-row items-center gap-sm">
              <Icon spec={{ set: 'Ionicons', name: 'restaurant-outline' }} size={iconSize.inline} color={colors.accent} />
              <Text className="text-lg font-bold text-ink">Choose your Cuisine</Text>
            </View>
            <Pressable onPress={() => router.push('/type-overview/cuisine')}>
              <Text className="text-xs font-normal text-accent">View all cuisines</Text>
            </Pressable>
          </View>
          <CuisineSelector cuisines={cuisines} onSelect={setActiveCuisine} />
          {cuisineListLoading ? (
            <SkeletonSection />
          ) : (
            <RestaurantSection
              restaurants={cuisineList}
              onSelectRestaurant={goToRestaurant}
              viewMoreLabel="View more"
              onViewMore={() => {
                if (activeCuisine && activeCuisine.id !== 'all') {
                  router.push(`/type/cuisine/${activeCuisine.id}`);
                } else {
                  router.push('/search');
                }
              }}
            />
          )}

          <NearbySection
            restaurants={restaurants.slice(0, 5)}
            onSelectRestaurant={goToRestaurant}
            onViewAll={() => router.push('/search')}
          />

          {brandRestaurants.length > 0 ? (
            <View>
              <View className="flex-row items-center justify-between px-md pb-sm pt-lg">
                <View className="flex-row items-center gap-sm">
                  <Text className="text-lg font-bold text-ink">Brands you know</Text>
                </View>
              </View>
              <BrandRail restaurants={brandRestaurants} onSelectRestaurant={goToRestaurant} />
            </View>
          ) : null}

          {SHOW_EXPLORE_BY_TYPE && occasions.length > 0 ? (
            <View>
              <View className="flex-row items-center justify-between px-md pb-sm pt-lg">
                <View className="flex-row items-center gap-sm">
                  <Text className="text-lg font-bold text-ink">Explore by type</Text>
                </View>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}
              >
                {occasions.map((occasion) => (
                  <Chip
                    key={occasion.id}
                    label={occasion.label}
                    onPress={() => router.push(`/type/occasion/${occasion.id}`)}
                  />
                ))}
              </ScrollView>
            </View>
          ) : null}

          {spotlights.map((spotlight, index) => (
            <View key={spotlight.cuisineId}>
              <View className="flex-row items-center justify-between px-md pb-sm pt-lg">
                <View className="flex-row items-center gap-sm">
                  <Icon
                    spec={{ set: 'Ionicons', name: index === 0 ? 'flame-outline' : 'trending-up-outline' }}
                    size={iconSize.inline}
                    color={colors.accent}
                  />
                  <Text className="text-lg font-bold text-ink">{spotlight.title}</Text>
                </View>
                <Pressable onPress={() => router.push(`/type/cuisine/${spotlight.cuisineId}`)}>
                  <Text className="text-xs font-normal text-accent">View more</Text>
                </Pressable>
              </View>
              {spotlight.isLoading ? (
                <SkeletonSection />
              ) : (
                <RestaurantSection
                  restaurants={spotlight.restaurants}
                  onSelectRestaurant={goToRestaurant}
                  viewMoreLabel="View more"
                  onViewMore={() => router.push(`/type/cuisine/${spotlight.cuisineId}`)}
                />
              )}
            </View>
          ))}

          <View className="flex-row items-center justify-between px-md pb-sm pt-lg">
            <View className="flex-row items-center gap-sm">
              <Icon spec={{ set: 'Ionicons', name: 'bag-outline' }} size={iconSize.inline} color={colors.accent} />
              <Text className="text-lg font-bold text-ink">Best Deliveries & Takeaways</Text>
            </View>
            <Pressable onPress={() => router.push({ pathname: '/search', params: { delivery: '1' } })}>
              <Text className="text-xs font-normal text-accent">View all</Text>
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
