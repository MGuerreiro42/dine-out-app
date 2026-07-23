import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { SearchBar, SideMenu } from '@/components/layout';
import {
  AmbientSelector,
  BenefitsGrid,
  CuisineSelector,
  FeaturedBanner,
  LocationHeader,
  OccasionSelector,
  QuickNavRow,
  RestaurantSection,
} from '@/features/search/components';
import { useHomeDiscovery } from '@/features/search/hooks';
import type { Restaurant } from '@/types';

export default function HomeScreen() {
  const router = useRouter();
  const {
    restaurants,
    cuisines,
    occasions,
    ambients,
    benefits,
    cuisineList,
    occasionList,
    ambientList,
    setActiveCuisine,
    setActiveOccasion,
    setActiveAmbient,
  } = useHomeDiscovery();

  const goToRestaurant = (restaurant: Restaurant) => {
    router.push(`/restaurant/${restaurant.id}`);
  };

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 24 }}>
      <View className="flex-row items-center gap-2.5 px-4 pt-4">
        <SearchBar />
        <SideMenu />
      </View>

      <LocationHeader />

      <QuickNavRow />

      {restaurants[0] ? <FeaturedBanner restaurant={restaurants[0]} /> : null}

      <View className="px-4 pb-1 pt-5">
        <Text className="text-xl font-bold text-ink">
          Choose your <Text className="text-gold">Cuisine</Text>
        </Text>
      </View>
      <CuisineSelector cuisines={cuisines} onSelect={setActiveCuisine} />
      <RestaurantSection
        restaurants={cuisineList}
        onSelectRestaurant={goToRestaurant}
        viewAllMessage="Veja todos os restaurantes desta cozinha."
      />

      <View className="px-4 pb-1 pt-5">
        <Text className="text-xl font-bold text-ink">
          What&apos;s the <Text className="text-gold">Occasion?</Text>
        </Text>
      </View>
      <OccasionSelector occasions={occasions} onSelect={setActiveOccasion} />
      <RestaurantSection
        restaurants={occasionList}
        onSelectRestaurant={goToRestaurant}
        viewAllMessage="Veja todos os restaurantes para esta ocasião."
      />

      <BenefitsGrid benefits={benefits} />

      <View className="px-4 pb-1 pt-1.5">
        <Text className="text-xl font-bold text-ink">
          Outstanding <Text className="text-gold">Ambients</Text>
        </Text>
      </View>
      <AmbientSelector ambients={ambients} onSelect={setActiveAmbient} />
      <RestaurantSection restaurants={ambientList} onSelectRestaurant={goToRestaurant} />

      <RestaurantSection
        title="Best Deliveries & Takeaways"
        restaurants={restaurants}
        onSelectRestaurant={goToRestaurant}
      />
    </ScrollView>
  );
}
