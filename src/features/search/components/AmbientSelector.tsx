import { ScrollView } from 'react-native';

import { Chip } from '@/components/ui';
import type { Ambient } from '@/features/search/types';

type AmbientSelectorProps = {
  ambients: (Ambient & { isActive: boolean })[];
  onSelect: (id: string) => void;
};

export function AmbientSelector({ ambients, onSelect }: AmbientSelectorProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingHorizontal: 16, paddingVertical: 4 }}
    >
      {ambients.map((ambient) => (
        <Chip
          key={ambient.id}
          label={ambient.label}
          active={ambient.isActive}
          onPress={() => onSelect(ambient.id)}
        />
      ))}
    </ScrollView>
  );
}
