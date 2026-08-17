import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { BottomSheet, Icon } from '@/components/ui';
import { useLocationStore } from '@/stores/location';

export function LocationHeader() {
  const [open, setOpen] = useState(false);
  const label = useLocationStore((s) => s.label);
  const status = useLocationStore((s) => s.status);
  const resolveLocation = useLocationStore((s) => s.resolveLocation);

  return (
    <View className="mt-3 px-4 pb-1.5">
      <Pressable onPress={() => setOpen(true)} className="flex-row items-center gap-1.5">
        <Icon spec={{ set: 'Ionicons', name: 'location-outline' }} size={13} color="#fbbf24" />
        <Text className="flex-shrink text-xs text-ink" numberOfLines={1}>
          <Text className="font-bold">{label}</Text>
        </Text>
        <Icon spec={{ set: 'Ionicons', name: 'chevron-down' }} size={12} color="#8a8580" />
      </Pressable>

      <BottomSheet visible={open} onClose={() => setOpen(false)}>
        <Text className="text-center text-sm text-gray-600">{label}</Text>
        {status === 'fallback' && (
          <Pressable onPress={resolveLocation} className="mt-3 rounded-xl bg-ink p-3.5">
            <Text className="text-center text-sm font-bold text-white">Tentar novamente</Text>
          </Pressable>
        )}
        <Pressable onPress={() => setOpen(false)} className="mt-1.5 rounded-xl bg-ink p-3.5">
          <Text className="text-center text-sm font-bold text-white">Fechar</Text>
        </Pressable>
      </BottomSheet>
    </View>
  );
}
