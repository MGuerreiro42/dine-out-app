import { Camera, Map as MapLibreMap } from '@maplibre/maplibre-react-native';
import type { MapRef } from '@maplibre/maplibre-react-native';
import { forwardRef } from 'react';
import { View } from 'react-native';

import { OSM_RASTER_STYLE } from '@/features/search/lib/mapStyle';

type LocationPickerMapProps = {
  initialLatitude: number;
  initialLongitude: number;
};

export const LocationPickerMap = forwardRef<MapRef, LocationPickerMapProps>(function LocationPickerMap(
  { initialLatitude, initialLongitude },
  ref,
) {
  return (
    <View className="flex-1">
      <MapLibreMap ref={ref} style={{ flex: 1 }} mapStyle={OSM_RASTER_STYLE}>
        <Camera
          initialViewState={{
            center: [initialLongitude, initialLatitude],
            zoom: 15,
          }}
        />
      </MapLibreMap>
      <View pointerEvents="none" className="absolute inset-0 items-center justify-center">
        <View className="h-4 w-4 -translate-y-4 rounded-full border-2 border-white bg-[#208AEF]" />
      </View>
    </View>
  );
});
