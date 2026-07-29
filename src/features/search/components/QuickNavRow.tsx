import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { BottomSheet, Icon, type IconSpec } from '@/components/ui';

const QUICK_NAV_OPTIONS: { id: string; label: string; icon: IconSpec; message: string }[] = [
  {
    id: 'dine-in',
    label: 'Dine-in',
    icon: { set: 'Ionicons', name: 'restaurant-outline' },
    message: 'Explorando opções para comer no local.',
  },
  {
    id: 'bars',
    label: 'Bars',
    icon: { set: 'MaterialCommunityIcons', name: 'glass-cocktail' },
    message: 'Explorando bares e drinks por perto.',
  },
  {
    id: 'takeout',
    label: 'Takeout',
    icon: { set: 'MaterialCommunityIcons', name: 'food-takeout-box' },
    message: 'Explorando opções de retirada.',
  },
];

export function QuickNavRow() {
  const [openMessage, setOpenMessage] = useState<string | null>(null);

  return (
    <View className="flex-row justify-around px-4 pb-1 pt-3.5">
      {QUICK_NAV_OPTIONS.map((option) => (
        <Pressable
          key={option.id}
          onPress={() => setOpenMessage(option.message)}
          className="items-center gap-1.5"
        >
          <View className="h-[52px] w-[52px] items-center justify-center rounded-full bg-sand">
            <Icon spec={option.icon} size={22} />
          </View>
          <Text className="text-[11px] font-bold text-ink">{option.label}</Text>
        </Pressable>
      ))}

      <BottomSheet visible={openMessage !== null} onClose={() => setOpenMessage(null)}>
        <Text className="text-center text-sm text-gray-600">{openMessage}</Text>
        <Pressable onPress={() => setOpenMessage(null)} className="mt-1.5 rounded-xl bg-ink p-3.5">
          <Text className="text-center text-sm font-bold text-white">Fechar</Text>
        </Pressable>
      </BottomSheet>
    </View>
  );
}
