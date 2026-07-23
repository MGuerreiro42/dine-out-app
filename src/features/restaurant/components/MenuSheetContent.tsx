import { Text, View } from 'react-native';

import type { MenuItem } from '@/features/restaurant/types';

type MenuSheetContentProps = {
  menu: MenuItem[];
};

export function MenuSheetContent({ menu }: MenuSheetContentProps) {
  return (
    <View>
      <Text className="mb-3.5 text-lg font-bold text-ink">Menu</Text>
      {menu.map((item) => (
        <View key={item.name} className="flex-row justify-between border-b border-gray-100 py-2.5">
          <Text className="text-sm text-ink">{item.name}</Text>
          <Text className="text-sm text-muted">{item.price}</Text>
        </View>
      ))}
    </View>
  );
}
