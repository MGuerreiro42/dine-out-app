import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { BottomSheet } from '@/components/ui';
import type { MenuItem } from '@/features/restaurant/types';

import { MenuSheetContent } from './MenuSheetContent';
import { RedirectOptionsSheetContent } from './RedirectOptionsSheetContent';
import { ReserveSheetContent } from './ReserveSheetContent';

type ActionKey = 'menu' | 'takeaway' | 'delivery' | 'reserve';

const ACTIONS: { key: ActionKey; icon: string; label: string }[] = [
  { key: 'menu', icon: '🍽️', label: 'Menu' },
  { key: 'takeaway', icon: '🥡', label: 'Takeaway' },
  { key: 'delivery', icon: '🛵', label: 'Delivery' },
  { key: 'reserve', icon: '📅', label: 'Reserve' },
];

type ActionGridProps = {
  menu: MenuItem[];
};

export function ActionGrid({ menu }: ActionGridProps) {
  const [openAction, setOpenAction] = useState<ActionKey | null>(null);

  return (
    <View className="flex-row justify-around px-4 py-4">
      {ACTIONS.map((action) => (
        <Pressable key={action.key} onPress={() => setOpenAction(action.key)} className="items-center gap-1.5">
          <View className="h-12 w-12 items-center justify-center rounded-2xl bg-sand">
            <Text className="text-lg">{action.icon}</Text>
          </View>
          <Text className="text-xs font-bold text-ink">{action.label}</Text>
        </Pressable>
      ))}

      <BottomSheet visible={openAction !== null} onClose={() => setOpenAction(null)}>
        {openAction === 'menu' ? <MenuSheetContent menu={menu} /> : null}
        {openAction === 'takeaway' ? (
          <RedirectOptionsSheetContent
            title="Takeaway"
            options={[
              { icon: '🛍️', label: 'Pedir pelo iFood' },
              { icon: '🌐', label: 'Site do restaurante' },
            ]}
          />
        ) : null}
        {openAction === 'delivery' ? (
          <RedirectOptionsSheetContent
            title="Delivery"
            options={[
              { icon: '🛍️', label: 'iFood' },
              { icon: '🚗', label: 'Uber Eats' },
            ]}
          />
        ) : null}
        {openAction === 'reserve' ? <ReserveSheetContent /> : null}
      </BottomSheet>
    </View>
  );
}
