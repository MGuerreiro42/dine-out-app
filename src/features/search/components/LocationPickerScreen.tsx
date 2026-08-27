import type { MapRef } from '@maplibre/maplibre-react-native';
import { useRouter } from 'expo-router';
import { useRef } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/ui';
import { LocationPickerMap } from '@/features/search/components/LocationPickerMap';
import { useLocationStore } from '@/stores/location';

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
      <View className="flex-row items-center gap-2.5 px-4 pt-4">
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full bg-[#f3f4f6]"
        >
          <Icon spec={{ set: 'Ionicons', name: 'chevron-back' }} size={18} color="#1f2937" />
        </Pressable>
        <Text className="text-base font-bold text-ink">Pick on map</Text>
      </View>

      <View className="flex-1">
        <LocationPickerMap ref={mapRef} initialLatitude={latitude} initialLongitude={longitude} />
      </View>

      <View className="p-4 pb-8">
        <Pressable onPress={handleConfirm} className="rounded-xl bg-ink p-3.5">
          <Text className="text-center text-sm font-bold text-white">Confirm location</Text>
        </Pressable>
      </View>
    </View>
  );
}
