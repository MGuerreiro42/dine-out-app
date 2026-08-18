import { MapPlaceholder } from '@/features/search/components/MapPlaceholder';
import type { Restaurant } from '@/types';

type SearchMapViewProps = {
  restaurants: Restaurant[];
  onSelectRestaurant: (restaurant: Restaurant) => void;
};

export function SearchMapView(_props: SearchMapViewProps) {
  return <MapPlaceholder message="O mapa interativo está disponível apenas no app nativo (iOS/Android)." />;
}
