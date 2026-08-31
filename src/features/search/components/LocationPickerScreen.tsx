import type { MapRef } from '@maplibre/maplibre-react-native';
import { useRouter } from 'expo-router';
import { useRef } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/ui';
import { LocationPickerMap } from '@/features/search/components/LocationPickerMap';
import { useLocationStore } from '@/stores/location';
import { colors, iconSize } from '@/theme';

export function LocationPickerScreen() {
  const router = useRouter();
  const mapRef = useRef<MapRef>(null);
  const latitude = useLocationStore((s) => s.latitude);
  const longitude = useLocationStore((s) => s.longitude);
  const setManualLocation = useLocationStore((s) => s.setManualLocation);

  const handleConfirm = async () => {
    if (Platform.OS !== 'web' && mapRef.current) {
      const [centerLongitude, centerLatitude] = await mapRef.current.getCenter();
      await setManualLocation({ latitude: centerLatitude, longitude: centerLongitude });
    }
    router.back();
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center gap-sm2 px-md pt-md">
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full bg-sand"
        >
          <Icon spec={{ set: 'Ionicons', name: 'chevron-back' }} size={iconSize.ui} color={colors.ink} />
        </Pressable>
        <Text className="text-base font-bold text-ink">Pick on map</Text>
      </View>

      <View className="flex-1">
        <LocationPickerMap ref={mapRef} initialLatitude={latitude} initialLongitude={longitude} />
      </View>

      <View className="p-md pb-xl">
        <Pressable onPress={handleConfirm} className="rounded-lg bg-ink p-md">
          <Text className="text-center text-sm font-bold text-white">Confirm location</Text>
        </Pressable>
      </View>
    </View>
  );
}
