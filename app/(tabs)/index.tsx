import { useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

import { SideMenu } from '@/components/layout';
import { Icon } from '@/components/ui';
import {
  AmbientSelector,
  CuisineSelector,
  FeaturedBanner,
  LocationHeader,
  OccasionSelector,
  RestaurantSection,
} from '@/features/search/components';
import { useHomeDiscovery } from '@/features/search/hooks';
import type { Restaurant } from '@/types';

export default function HomeScreen() {
  const router = useRouter();
  const {
    isLoading,
    isError,
    refetch,
    restaurants,
    cuisines,
    occasions,
    ambients,
    cuisineList,
    occasionList,
    ambientList,
    featuredTagline,
    setActiveCuisine,
    setActiveOccasion,
    setActiveAmbient,
  } = useHomeDiscovery();
  const activeCuisine = cuisines.find((c) => c.isActive);
  const activeOccasion = occasions.find((o) => o.isActive);
  const activeAmbient = ambients.find((a) => a.isActive);
  const deliveryList = restaurants.filter((r) => r.hasDelivery);

  const goToRestaurant = (restaurant: Restaurant) => {
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
        <Text className="text-center text-sm text-muted">Não foi possível carregar a Home.</Text>
        <Pressable onPress={() => refetch()} className="rounded-xl bg-ink px-4 py-2.5">
          <Text className="text-sm font-bold text-white">Tentar de novo</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
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

      <LocationHeader />

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
        {restaurants[0] ? <FeaturedBanner restaurant={restaurants[0]} tagline={featuredTagline} /> : null}

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

      <View className="flex-row items-center justify-between px-4 pb-2 pt-6">
        <View className="flex-row items-center gap-1.5">
          <Icon spec={{ set: 'Ionicons', name: 'sparkles' }} size={16} color="#4f46e5" />
          <Text className="text-[17px] font-bold text-[#111827]">What&apos;s the Occasion?</Text>
        </View>
        <Pressable onPress={() => router.push('/type-overview/occasion')}>
          <Text className="text-xs font-normal text-[#4f46e5]">View all occasions</Text>
        </Pressable>
      </View>
      <OccasionSelector occasions={occasions} onSelect={setActiveOccasion} />
      <RestaurantSection
        restaurants={occasionList}
        onSelectRestaurant={goToRestaurant}
        viewMoreLabel="View more"
        onViewMore={() => {
          if (activeOccasion) router.push(`/type/occasion/${activeOccasion.id}`);
        }}
      />

      <View className="flex-row items-center justify-between px-4 pb-2 pt-6">
        <View className="flex-row items-center gap-1.5">
          <Icon spec={{ set: 'Ionicons', name: 'star-outline' }} size={16} color="#4f46e5" />
          <Text className="text-[17px] font-bold text-[#111827]">Outstanding Ambients</Text>
        </View>
        <Pressable onPress={() => router.push('/type-overview/ambient')}>
          <Text className="text-xs font-normal text-[#4f46e5]">View all ambients</Text>
        </Pressable>
      </View>
      <AmbientSelector ambients={ambients} onSelect={setActiveAmbient} />
      <RestaurantSection
        restaurants={ambientList}
        onSelectRestaurant={goToRestaurant}
        viewMoreLabel="View more"
        onViewMore={() => {
          if (activeAmbient) router.push(`/type/ambient/${activeAmbient.id}`);
        }}
      />

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
    </View>
  );
}
