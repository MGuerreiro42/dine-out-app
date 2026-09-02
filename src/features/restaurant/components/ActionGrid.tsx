import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { BottomSheet, Icon, type IconSpec } from '@/components/ui';
import type { MenuItem } from '@/features/restaurant/types';
import { colors, iconSize } from '@/theme';

import { MenuSheetContent } from './MenuSheetContent';

type ActionKey = 'menu' | 'takeaway' | 'delivery' | 'reserve';

// Takeaway/Delivery/Reserve have no real per-restaurant backing data — no partner
// links, no reservation system — so they stay disabled for every restaurant until
// that capability exists, rather than opening a sheet that simulates having it.
const ACTIONS: { key: ActionKey; icon: IconSpec; label: string }[] = [
  { key: 'menu', icon: { set: 'Ionicons', name: 'restaurant-outline' }, label: 'Menu' },
  { key: 'takeaway', icon: { set: 'MaterialCommunityIcons', name: 'food-takeout-box' }, label: 'Takeaway' },
  { key: 'delivery', icon: { set: 'MaterialCommunityIcons', name: 'moped-outline' }, label: 'Delivery' },
  { key: 'reserve', icon: { set: 'Ionicons', name: 'calendar-outline' }, label: 'Reserve' },
];

type ActionGridProps = {
  menu: MenuItem[];
};

export function ActionGrid({ menu }: ActionGridProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const hasMenu = menu.length > 0;

  return (
    <View className="flex-row gap-sm2 px-md py-md">
      {ACTIONS.map((action) => {
        const isMenu = action.key === 'menu';
        const enabled = isMenu && hasMenu;
        return (
          <Pressable
            key={action.key}
            onPress={enabled ? () => setMenuOpen(true) : undefined}
            disabled={!enabled}
            className={`flex-1 items-center gap-sm rounded-lg border py-sm2 ${
              enabled ? 'border-accent bg-accent' : 'border-sand bg-white opacity-60'
            }`}
          >
            <Icon spec={action.icon} size={iconSize.ui} color={enabled ? colors.white : colors.inkFaint} />
            <Text className={`text-xs font-bold ${enabled ? 'text-white' : 'text-muted'}`}>{action.label}</Text>
          </Pressable>
        );
      })}

      <BottomSheet visible={menuOpen} onClose={() => setMenuOpen(false)}>
        <MenuSheetContent menu={menu} />
      </BottomSheet>
    </View>
  );
}
