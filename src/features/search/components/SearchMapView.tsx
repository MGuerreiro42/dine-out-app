import MapView, { Marker } from 'react-native-maps';

import { MapPlaceholder } from '@/features/search/components/MapPlaceholder';
import { useLocationStore } from '@/stores/location';
import type { Restaurant } from '@/types';

type SearchMapViewProps = {
  restaurants: Restaurant[];
  onSelectRestaurant: (restaurant: Restaurant) => void;
};

const hasGoogleMapsApiKey = Boolean(process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY);

export function SearchMapView({ restaurants, onSelectRestaurant }: SearchMapViewProps) {
  const latitude = useLocationStore((s) => s.latitude);
  const longitude = useLocationStore((s) => s.longitude);

  if (!hasGoogleMapsApiKey) {
    return <MapPlaceholder message="O mapa interativo estará disponível em breve." />;
  }

  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude,
        longitude,
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
