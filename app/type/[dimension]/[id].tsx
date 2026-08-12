import { useLocalSearchParams } from 'expo-router';

import { TypeDetailScreen } from '@/features/search/components/TypeDetailScreen';

export default function TypeDetailRoute() {
  const { dimension, id } = useLocalSearchParams<{ dimension: string; id: string }>();
  return <TypeDetailScreen dimension={dimension as 'cuisine' | 'occasion' | 'ambient'} id={id} />;
}
