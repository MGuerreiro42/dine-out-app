import { ScrollView } from 'react-native';

import { Chip } from '@/components/ui';

type CategoryTabsRowProps = {
  items: { id: string; label: string; isActive: boolean }[];
  onSelect: (id: string) => void;
};

export function CategoryTabsRow({ items, onSelect }: CategoryTabsRowProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingHorizontal: 18 }}
    >
      {items.map((item) => (
        <Chip key={item.id} label={item.label} active={item.isActive} onPress={() => onSelect(item.id)} />
      ))}
    </ScrollView>
  );
}
