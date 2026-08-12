import { useLocalSearchParams } from 'expo-router';

import { TypeOverviewScreen } from '@/features/search/components/TypeOverviewScreen';

export default function TypeOverviewRoute() {
  const { dimension } = useLocalSearchParams<{ dimension: string }>();
  return <TypeOverviewScreen dimension={dimension as 'cuisine' | 'occasion' | 'ambient'} />;
}
