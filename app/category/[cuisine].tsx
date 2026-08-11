import { useLocalSearchParams } from 'expo-router';

import { TaxonomyListingScreen } from '@/features/search/components';

export default function CategoryDetailScreen() {
  const { cuisine } = useLocalSearchParams<{ cuisine: string }>();

  return (
    <TaxonomyListingScreen
      dimension="cuisine"
      initialId={cuisine}
      bestRatedHeading={(label) => ({ prefix: 'The best rated ', highlighted: `${label}s` })}
      nearYouHeading={(label) => ({ highlighted: `${label}s`, suffix: ' Near You' })}
      fallbackBackRoute="/category"
    />
  );
}
