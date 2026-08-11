import MapView, { Marker } from 'react-native-maps';

import { MOCK_LOCATION } from '@/features/search/api/useRestaurantsQuery';
import { MapPlaceholder } from '@/features/search/components/MapPlaceholder';
import type { Restaurant } from '@/types';

type SearchMapViewProps = {
  restaurants: Restaurant[];
  onSelectRestaurant: (restaurant: Restaurant) => void;
};

// TEMPORARY: the Google Maps Android SDK crashes the whole app on mount
// (native, uncatchable from JS) when no API key is configured — confirmed
// on a real device/emulator, see PROJECT.md's ADR log. Setting one up
// requires Google Cloud billing to be enabled on the account, currently
// blocked on that account's own KYC flow — not a code problem. Falls back
// to the same placeholder web already uses until a key exists; once
// EXPO_PUBLIC_GOOGLE_MAPS_API_KEY is set (and wired into app.json / a
// native rebuild), this same condition switches back to the real map with
// no further code change needed here.
const hasGoogleMapsApiKey = Boolean(process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY);

export function SearchMapView({ restaurants, onSelectRestaurant }: SearchMapViewProps) {
  if (!hasGoogleMapsApiKey) {
    return <MapPlaceholder message="O mapa interativo estará disponível em breve." />;
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
