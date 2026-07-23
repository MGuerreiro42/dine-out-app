import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { BottomSheet } from '@/components/ui';

const USER_LOCATION = { area: 'Sheetal Park', address: 'Manharpura 1, Dharam Nagar Society' };

export function LocationHeader() {
  const [open, setOpen] = useState(false);

  return (
    <View className="mt-3">
      <Pressable onPress={() => setOpen(true)} className="flex-row items-center gap-1.5">
        <Text className="text-xs">📍</Text>
        <Text className="text-sm font-bold text-ink">{USER_LOCATION.area}</Text>
        <Text className="text-[11px] text-muted">▾</Text>
      </Pressable>
      <Text className="ml-[19px] mt-0.5 text-xs text-muted">{USER_LOCATION.address}</Text>

      <BottomSheet visible={open} onClose={() => setOpen(false)}>
        <Text className="text-center text-sm text-gray-600">Selecione sua localização atual.</Text>
        <Pressable onPress={() => setOpen(false)} className="mt-1.5 rounded-xl bg-ink p-3.5">
          <Text className="text-center text-sm font-bold text-white">Fechar</Text>
        </Pressable>
      </BottomSheet>
    </View>
  );
}
