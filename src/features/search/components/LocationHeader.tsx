import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { BottomSheet, Icon } from '@/components/ui';

const USER_LOCATION = { area: 'Sheetal Park', address: 'Manharpura 1, Dharam Nagar Society' };

export function LocationHeader() {
  const [open, setOpen] = useState(false);

  return (
    <View className="mt-3 px-4">
      <Pressable onPress={() => setOpen(true)} className="flex-row items-center gap-1.5">
        <Icon spec={{ set: 'Ionicons', name: 'location' }} size={13} color="#f59e0b" />
        <Text className="flex-shrink text-xs text-ink" numberOfLines={1}>
          <Text className="font-bold">{USER_LOCATION.area}</Text>
          <Text className="text-muted"> · {USER_LOCATION.address}</Text>
        </Text>
        <Icon spec={{ set: 'Ionicons', name: 'chevron-down' }} size={12} color="#8a8580" />
      </Pressable>

      <BottomSheet visible={open} onClose={() => setOpen(false)}>
        <Text className="text-center text-sm text-gray-600">Selecione sua localização atual.</Text>
        <Pressable onPress={() => setOpen(false)} className="mt-1.5 rounded-xl bg-ink p-3.5">
          <Text className="text-center text-sm font-bold text-white">Fechar</Text>
        </Pressable>
      </BottomSheet>
    </View>
  );
}
