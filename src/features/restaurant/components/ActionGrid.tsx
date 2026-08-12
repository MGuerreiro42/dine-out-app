import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { BottomSheet, Icon, type IconSpec } from '@/components/ui';
import type { MenuItem } from '@/features/restaurant/types';

import { MenuSheetContent } from './MenuSheetContent';
import { RedirectOptionsSheetContent } from './RedirectOptionsSheetContent';
import { ReserveSheetContent } from './ReserveSheetContent';

type ActionKey = 'menu' | 'takeaway' | 'delivery' | 'reserve';

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
  const [openAction, setOpenAction] = useState<ActionKey | null>(null);

  return (
    <View className="flex-row gap-2.5 px-4 py-4">
      {ACTIONS.map((action) => (
        <Pressable
          key={action.key}
          onPress={() => setOpenAction(action.key)}
          className="flex-1 items-center gap-1.5 rounded-2xl border border-[#e0e7ff] bg-white py-3"
        >
          <Icon spec={action.icon} size={20} color="#4f46e5" />
          <Text className="text-xs font-bold text-[#4f46e5]">{action.label}</Text>
        </Pressable>
      ))}

      <BottomSheet visible={openAction !== null} onClose={() => setOpenAction(null)}>
        {openAction === 'menu' ? <MenuSheetContent menu={menu} /> : null}
        {openAction === 'takeaway' ? (
          <RedirectOptionsSheetContent
            title="Takeaway"
            options={[
              { icon: { set: 'Ionicons', name: 'bag-outline' }, label: 'Pedir pelo iFood' },
              { icon: { set: 'Ionicons', name: 'globe-outline' }, label: 'Site do restaurante' },
            ]}
          />
        ) : null}
        {openAction === 'delivery' ? (
          <RedirectOptionsSheetContent
            title="Delivery"
            options={[
              { icon: { set: 'Ionicons', name: 'bag-outline' }, label: 'iFood' },
              { icon: { set: 'Ionicons', name: 'car-outline' }, label: 'Uber Eats' },
            ]}
          />
        ) : null}
        {openAction === 'reserve' ? <ReserveSheetContent /> : null}
      </BottomSheet>
    </View>
  );
}
