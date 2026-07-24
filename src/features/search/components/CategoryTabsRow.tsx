import { ScrollView } from 'react-native';

import { Chip } from '@/components/ui';

type CategoryTabsRowProps = {
  cuisines: { id: string; label: string; isActive: boolean }[];
  onSelect: (id: string) => void;
};

export function CategoryTabsRow({ cuisines, onSelect }: CategoryTabsRowProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingHorizontal: 18 }}
    >
      {cuisines.map((cuisine) => (
        <Chip key={cuisine.id} label={cuisine.label} active={cuisine.isActive} onPress={() => onSelect(cuisine.id)} />
      ))}
    </ScrollView>
  );
}
