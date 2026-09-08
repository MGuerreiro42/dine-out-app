import { Text, View } from 'react-native';

import type { MenuItem } from '@/features/restaurant/types';

type MenuSheetContentProps = {
  menu: MenuItem[];
};

export function MenuSheetContent({ menu }: MenuSheetContentProps) {
  return (
    <View>
      <Text className="mb-md text-lg font-bold text-ink">Menu</Text>
      {menu.map((item) => (
        <View key={item.id} className="flex-row justify-between border-b border-sand-border py-sm2">
          <Text className="text-sm text-ink">{item.name}</Text>
          <Text className="text-sm text-muted">{item.price}</Text>
        </View>
      ))}
    </View>
  );
}
