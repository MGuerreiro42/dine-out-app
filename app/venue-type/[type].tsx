import { useLocalSearchParams } from 'expo-router';

import { TaxonomyListingScreen } from '@/features/search/components';

export default function VenueTypeListingScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();

  return (
    <TaxonomyListingScreen
      dimension="venueType"
      initialId={type}
      bestRatedHeading={(label) => ({ prefix: 'Top-rated ', highlighted: label })}
      nearYouHeading={(label) => ({ highlighted: label, suffix: ' Near You' })}
      fallbackBackRoute="/"
    />
  );
}
