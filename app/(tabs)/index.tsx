import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { RADIUS_OPTIONS_KM } from '@/components/layout';
import { Chip, EmptyState, ErrorState, LoadingState, SectionHeader } from '@/components/ui';
import {
  BrandRail,
  CuisineSelector,
  FeaturedBanner,
  HomeSkeleton,
  NearbySection,
  RestaurantSection,
  SkeletonSection,
} from '@/features/search/components';
import { useHomeDiscovery } from '@/features/search/hooks';
import { useLocationStore } from '@/stores/location';
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

  if (isLoading) {
    return (
      <View className="flex-1 bg-white">
        <HomeSkeleton />
      </View>
    );
  }

  if (isError) {
    return <ErrorState message="Couldn't load Home." onRetry={() => refetch()} />;
  }

  return (
    <View className="flex-1 bg-white">
      {restaurants.length === 0 && isFetching ? (
        <LoadingState message="Searching a wider area..." />
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

          <SectionHeader
            icon={{ set: 'Ionicons', name: 'restaurant-outline' }}
            title="Choose your Cuisine"
            viewAll={{ label: 'View all cuisines', onPress: () => router.push('/type-overview/cuisine') }}
          />
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
              <SectionHeader title="Brands you know" />
              <BrandRail restaurants={brandRestaurants} onSelectRestaurant={goToRestaurant} />
            </View>
          ) : null}

          {SHOW_EXPLORE_BY_TYPE && occasions.length > 0 ? (
            <View>
              <SectionHeader title="Explore by type" />
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
              <SectionHeader
                icon={{ set: 'Ionicons', name: index === 0 ? 'flame-outline' : 'trending-up-outline' }}
                title={spotlight.title}
                viewAll={{ label: 'View more', onPress: () => router.push(`/type/cuisine/${spotlight.cuisineId}`) }}
              />
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

          <SectionHeader
            icon={{ set: 'Ionicons', name: 'bag-outline' }}
            title="Best Deliveries & Takeaways"
            viewAll={{ onPress: () => router.push({ pathname: '/search', params: { delivery: '1' } }) }}
          />
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
