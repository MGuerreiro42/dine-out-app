import { MapPlaceholder } from '@/features/search/components/MapPlaceholder';
import type { Restaurant } from '@/types';

type SearchMapViewProps = {
  restaurants: Restaurant[];
  onSelectRestaurant: (restaurant: Restaurant) => void;
};

// react-native-maps has no web renderer at all — this stands in for the
// live MapView on web (Metro picks this file over SearchMapView.tsx for the
// web platform), so restaurants isn't used here.
export function SearchMapView(_props: SearchMapViewProps) {
  return <MapPlaceholder message="O mapa interativo está disponível apenas no app nativo (iOS/Android)." />;
}
