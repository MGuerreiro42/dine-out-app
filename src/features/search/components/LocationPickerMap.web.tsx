import { forwardRef } from 'react';

import { MapPlaceholder } from '@/features/search/components/MapPlaceholder';

type LocationPickerMapProps = {
  initialLatitude: number;
  initialLongitude: number;
};

export const LocationPickerMap = forwardRef<never, LocationPickerMapProps>(function LocationPickerMap() {
  return <MapPlaceholder message="Manual map selection will be available soon." />;
});
