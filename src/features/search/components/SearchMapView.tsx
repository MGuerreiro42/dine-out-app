import MapView, { Marker } from 'react-native-maps';

import { MOCK_LOCATION } from '@/features/search/api/useRestaurantsQuery';
import { MapPlaceholder } from '@/features/search/components/MapPlaceholder';
import type { Restaurant } from '@/types';

type SearchMapViewProps = {
  restaurants: Restaurant[];
  onSelectRestaurant: (restaurant: Restaurant) => void;
};

const hasGoogleMapsApiKey = Boolean(process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY);

export function SearchMapView({ restaurants, onSelectRestaurant }: SearchMapViewProps) {
  if (!hasGoogleMapsApiKey) {
    return <MapPlaceholder message="The interactive map will be available soon." />;
  }

  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: MOCK_LOCATION.latitude,
        longitude: MOCK_LOCATION.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      {restaurants.map((restaurant) => (
        <Marker
          key={restaurant.id}
          coordinate={{ latitude: restaurant.latitude, longitude: restaurant.longitude }}
          title={restaurant.name}
          description={`${restaurant.rating} · ${restaurant.priceLevel}`}
          onPress={() => onSelectRestaurant(restaurant)}
        />
      ))}
    </MapView>
  );
}
