import { Camera, Map as MapLibreMap, Marker } from '@maplibre/maplibre-react-native';
import { View } from 'react-native';

import { OSM_RASTER_STYLE } from '@/features/search/lib/mapStyle';
import { useLocationStore } from '@/stores/location';
import type { Restaurant } from '@/types';

type SearchMapViewProps = {
  restaurants: Restaurant[];
  onSelectRestaurant: (restaurant: Restaurant) => void;
};

export function SearchMapView({ restaurants, onSelectRestaurant }: SearchMapViewProps) {
  const latitude = useLocationStore((s) => s.latitude);
  const longitude = useLocationStore((s) => s.longitude);

  return (
    <MapLibreMap style={{ flex: 1 }} mapStyle={OSM_RASTER_STYLE}>
      <Camera
        initialViewState={{
          center: [longitude, latitude],
          zoom: 13,
        }}
      />
      {restaurants.map((restaurant) => (
        <Marker
          key={restaurant.id}
          lngLat={[restaurant.longitude, restaurant.latitude]}
          onPress={() => onSelectRestaurant(restaurant)}
        >
          <View className="h-6 w-6 rounded-full border-2 border-white bg-[#208AEF]" />
        </Marker>
      ))}
    </MapLibreMap>
  );
}
