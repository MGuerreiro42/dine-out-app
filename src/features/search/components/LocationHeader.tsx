import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Modal, Platform, Pressable, Text, useWindowDimensions, View } from 'react-native';

import { BottomSheet, Icon } from '@/components/ui';
import { AddressSearchInput } from '@/features/search/components/AddressSearchInput';
import { CurrentLocationCard } from '@/features/search/components/CurrentLocationCard';
import { useLocationStore } from '@/stores/location';

export const RADIUS_OPTIONS_KM = [5, 10, 50, 100];

export function LocationHeader() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [radiusMenuOpen, setRadiusMenuOpen] = useState(false);
  const [radiusAnchor, setRadiusAnchor] = useState({ top: 0, left: 0 });
  const label = useLocationStore((s) => s.label);
  const status = useLocationStore((s) => s.status);
  const radiusKm = useLocationStore((s) => s.radiusKm);
  const setRadiusKm = useLocationStore((s) => s.setRadiusKm);
  const radiusTriggerRef = useRef<View>(null);
  const { width: windowWidth } = useWindowDimensions();

  const openRadiusMenu = () => {
    radiusTriggerRef.current?.measureInWindow((x, y, width, height) => {
      setRadiusAnchor({ top: y + height + 4, left: Math.min(x, windowWidth - width) });
      setRadiusMenuOpen(true);
    });
  };

  return (
    <View className="mt-3 flex-row items-center gap-2 px-4 pb-1.5">
      <Pressable onPress={() => setOpen(true)} className="flex-shrink flex-row items-center gap-1.5">
        <Icon spec={{ set: 'Ionicons', name: 'location-outline' }} size={13} color="#fbbf24" />
        <Text className="flex-shrink text-xs text-ink" numberOfLines={1}>
          <Text className="font-bold">{label}</Text>
        </Text>
        <Icon spec={{ set: 'Ionicons', name: 'chevron-down' }} size={12} color="#8a8580" />
      </Pressable>

      <Pressable
        ref={radiusTriggerRef}
        onPress={openRadiusMenu}
        className="flex-row items-center gap-1 rounded-full border border-sand px-2 py-0.5"
      >
        <Text className="text-xs font-bold text-ink">{radiusKm} km</Text>
        <Icon spec={{ set: 'Ionicons', name: 'chevron-down' }} size={12} color="#8a8580" />
      </Pressable>

      <Modal
        visible={radiusMenuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setRadiusMenuOpen(false)}
      >
        <Pressable className="flex-1" onPress={() => setRadiusMenuOpen(false)}>
          <View
            className="absolute w-28 rounded-2xl bg-white py-2 shadow-lg"
            style={{ top: radiusAnchor.top, left: radiusAnchor.left }}
          >
            {RADIUS_OPTIONS_KM.map((km) => (
              <Pressable
                key={km}
                onPress={() => {
                  setRadiusKm(km);
                  setRadiusMenuOpen(false);
                }}
                className="px-4 py-2.5"
              >
                <Text className={`text-sm ${km === radiusKm ? 'font-bold text-[#4f46e5]' : 'text-[#1f2937]'}`}>
                  {km} km
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      <BottomSheet visible={open} onClose={() => setOpen(false)}>
        <Text className="mb-3.5 text-lg font-bold text-ink">Your location</Text>

        <CurrentLocationCard />

        <View className="mt-3">
          <AddressSearchInput />
        </View>

        {Platform.OS !== 'web' && (
          <Pressable
            onPress={() => {
              setOpen(false);
              router.push('/location-picker');
            }}
            className="mt-3 flex-row items-center gap-2 rounded-2xl border border-sand p-3"
          >
            <Icon spec={{ set: 'Ionicons', name: 'map-outline' }} size={18} color="#4f46e5" />
            <Text className="text-sm font-bold text-ink">Pick on map</Text>
          </Pressable>
        )}

        {status === 'denied' && Platform.OS !== 'web' && (
          <Pressable onPress={() => Linking.openSettings()} className="mt-3 rounded-xl bg-ink p-3.5">
            <Text className="text-center text-sm font-bold text-white">Enable location</Text>
          </Pressable>
        )}

        <Pressable onPress={() => setOpen(false)} className="mt-1.5 rounded-xl bg-ink p-3.5">
          <Text className="text-center text-sm font-bold text-white">Close</Text>
        </Pressable>
      </BottomSheet>
    </View>
  );
}
