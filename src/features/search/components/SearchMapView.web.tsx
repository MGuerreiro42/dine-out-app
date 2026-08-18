import { MapPlaceholder } from '@/features/search/components/MapPlaceholder';
import type { Restaurant } from '@/types';

type SearchMapViewProps = {
  restaurants: Restaurant[];
  onSelectRestaurant: (restaurant: Restaurant) => void;
};

export function SearchMapView(_props: SearchMapViewProps) {
  return <MapPlaceholder message="The interactive map is only available in the native app (iOS/Android)." />;
}
