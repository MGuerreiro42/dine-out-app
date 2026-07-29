import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { BottomSheet, Icon } from '@/components/ui';
import type { CategorySubtype } from '@/features/search/types';

type SubtypeRowProps = {
  subtypes: CategorySubtype[];
};

export function SubtypeRow({ subtypes }: SubtypeRowProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <View className="px-4 py-3">
      <Pressable onPress={() => setSheetOpen(true)} className="rounded-2xl bg-sand p-4">
        <Text className="text-center text-[13px] font-bold text-ink">
          What&apos;s the flavour today? Explore by style
        </Text>
      </Pressable>

      <View className="mt-2.5 flex-row justify-around">
        {subtypes.map((subtype) => (
          <Pressable key={subtype.label} onPress={() => setSheetOpen(true)} className="items-center gap-1.5">
            <View className="h-[52px] w-[52px] items-center justify-center rounded-2xl bg-sand">
              <Icon spec={subtype.icon} size={22} />
            </View>
            <Text className="text-[11px] font-bold text-ink">{subtype.label}</Text>
          </Pressable>
        ))}
      </View>

      <BottomSheet visible={sheetOpen} onClose={() => setSheetOpen(false)}>
        <Text className="text-center text-sm text-gray-600">Filtro por estilo em breve.</Text>
        <Pressable onPress={() => setSheetOpen(false)} className="mt-1.5 rounded-xl bg-ink p-3.5">
          <Text className="text-center text-sm font-bold text-white">Fechar</Text>
        </Pressable>
      </BottomSheet>
    </View>
  );
}
