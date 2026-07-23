import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { BottomSheet } from '@/components/ui';

const QUICK_NAV_OPTIONS = [
  { id: 'dine-in', label: 'Dine-in', icon: '🍽️', message: 'Explorando opções para comer no local.' },
  { id: 'bars', label: 'Bars', icon: '🍸', message: 'Explorando bares e drinks por perto.' },
  { id: 'takeout', label: 'Takeout', icon: '🥡', message: 'Explorando opções de retirada.' },
] as const;

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
            <Text className="text-lg">{option.icon}</Text>
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
