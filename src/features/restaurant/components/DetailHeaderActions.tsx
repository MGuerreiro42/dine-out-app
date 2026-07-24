import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';

import { BottomSheet } from '@/components/ui';

import { RedirectOptionsSheetContent } from './RedirectOptionsSheetContent';

const ICON_BUTTON_CLASS = 'h-10 w-10 items-center justify-center rounded-full bg-black/45';

export function DetailHeaderActions() {
  const router = useRouter();
  const [locationSheetOpen, setLocationSheetOpen] = useState(false);

  return (
    <>
      <View className="absolute right-3.5 top-3.5 gap-2">
        <Pressable onPress={() => setLocationSheetOpen(true)} className={ICON_BUTTON_CLASS}>
          <Text className="text-base text-white">📍</Text>
        </Pressable>
        <Pressable
          onPress={() => Alert.alert('Simulação', 'Configurações do restaurante (em breve)')}
          className={ICON_BUTTON_CLASS}
        >
          <Text className="text-base text-white">⚙️</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/profile')} className={ICON_BUTTON_CLASS}>
          <Text className="text-base text-white">👤</Text>
        </Pressable>
      </View>

      {/* The like/favorite button (US7, FR-016) slots in above this once stores/favorites.ts exists */}
      <Pressable
        onPress={() => Alert.alert('Simulação', 'Compartilhar este restaurante')}
        className={`absolute bottom-14 right-3.5 ${ICON_BUTTON_CLASS}`}
      >
        <Text className="text-base text-white">⤴</Text>
      </Pressable>

      <BottomSheet visible={locationSheetOpen} onClose={() => setLocationSheetOpen(false)}>
        <RedirectOptionsSheetContent title="Localização" options={[{ icon: '🗺️', label: 'Abrir no Google Maps' }]} />
      </BottomSheet>
    </>
  );
}
