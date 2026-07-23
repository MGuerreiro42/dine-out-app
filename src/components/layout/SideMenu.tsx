import { useState } from 'react';
import { Pressable, Text } from 'react-native';

import { BottomSheet } from '@/components/ui';

export function SideMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        className="h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-ink"
      >
        <Text className="text-lg leading-none text-white">≡</Text>
      </Pressable>
      <BottomSheet visible={open} onClose={() => setOpen(false)}>
        <Text className="text-center text-sm text-gray-600">Abrindo menu principal do app...</Text>
        <Pressable onPress={() => setOpen(false)} className="mt-1.5 rounded-xl bg-ink p-3.5">
          <Text className="text-center text-sm font-bold text-white">Fechar</Text>
        </Pressable>
      </BottomSheet>
    </>
  );
}
