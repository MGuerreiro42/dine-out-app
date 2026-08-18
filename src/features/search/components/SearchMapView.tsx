import { Camera, Map as MapLibreMap, Marker } from '@maplibre/maplibre-react-native';
import type { StyleSpecification } from '@maplibre/maplibre-react-native';
import { View } from 'react-native';

import { useLocationStore } from '@/stores/location';
import type { Restaurant } from '@/types';

type SearchMapViewProps = {
  restaurants: Restaurant[];
  onSelectRestaurant: (restaurant: Restaurant) => void;
};

const OSM_RASTER_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors',
    },
  },
  layers: [
    {
      id: 'osm',
      type: 'raster',
      source: 'osm',
    },
  ],
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
