import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Modal, Platform, Pressable, Text, useWindowDimensions, View } from "react-native";

import { BottomSheet, Icon } from "@/components/ui";
import { AddressSearchInput } from "@/features/search/components/AddressSearchInput";
import { CurrentLocationCard } from "@/features/search/components/CurrentLocationCard";
import { useLocationStore } from "@/stores/location";
import { colors, iconSize } from "@/theme";

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

  // `label` is store-formatted as "{street}, {district/city}" (src/stores/location.ts)
  // — split on the first ", " so the street can render bold/full-size and the rest
  // normal-weight/smaller, no store change needed.
  const [street, ...restParts] = label.split(", ");
  const rest = restParts.join(", ");

  return (
    <View className="mt-sm2 flex-row items-center justify-between gap-sm px-md pb-sm">
      <Pressable onPress={() => setOpen(true)} className="flex-1 flex-row items-center gap-sm">
        <Icon spec={{ set: "Ionicons", name: "location-outline" }} size={iconSize.micro} color={colors.rating} />
        <Text className="flex-shrink text-xs text-ink" numberOfLines={1}>
          <Text className="font-bold">{street}</Text>
          {rest ? <Text className="text-caption font-normal text-muted">, {rest}</Text> : null}
        </Text>
        <Icon spec={{ set: "Ionicons", name: "chevron-down" }} size={iconSize.micro} color={colors.inkFaint} />
      </Pressable>

      <Pressable
        ref={radiusTriggerRef}
        onPress={openRadiusMenu}
        className="flex-row items-center gap-xs rounded-full border border-sand px-sm py-xs"
      >
        <Text className="text-xs font-bold text-ink">{radiusKm} km</Text>
        <Icon spec={{ set: "Ionicons", name: "chevron-down" }} size={iconSize.micro} color={colors.inkFaint} />
      </Pressable>

      <Modal visible={radiusMenuOpen} transparent animationType="fade" onRequestClose={() => setRadiusMenuOpen(false)}>
        <Pressable className="flex-1" onPress={() => setRadiusMenuOpen(false)}>
          <View
            className="absolute w-28 rounded-2xl bg-white py-sm shadow-lg"
            style={{ top: radiusAnchor.top, left: radiusAnchor.left }}
          >
            {RADIUS_OPTIONS_KM.map((km) => (
              <Pressable
                key={km}
                onPress={() => {
                  setRadiusKm(km);
                  setRadiusMenuOpen(false);
                }}
                className="px-md py-sm2"
              >
                <Text className={`text-sm ${km === radiusKm ? "font-bold text-accent" : "text-ink"}`}>{km} km</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      <BottomSheet visible={open} onClose={() => setOpen(false)}>
        <Text className="mb-md text-lg font-bold text-ink">Your location</Text>

        <CurrentLocationCard />

        <View className="mt-sm2">
          <AddressSearchInput />
        </View>

        {Platform.OS !== "web" && (
          <Pressable
            onPress={() => {
              setOpen(false);
              router.push("/location-picker");
            }}
            className="mt-sm2 flex-row items-center gap-sm rounded-lg border border-sand p-sm2"
          >
            <Icon spec={{ set: "Ionicons", name: "map-outline" }} size={iconSize.ui} color={colors.accent} />
            <Text className="text-sm font-bold text-ink">Pick on map</Text>
          </Pressable>
        )}

        {status === "denied" && Platform.OS !== "web" && (
          <Pressable onPress={() => Linking.openSettings()} className="mt-sm2 rounded-lg bg-ink p-md">
            <Text className="text-center text-sm font-bold text-white">Enable location</Text>
          </Pressable>
        )}

        <Pressable onPress={() => setOpen(false)} className="mt-sm rounded-lg bg-ink p-md">
          <Text className="text-center text-sm font-bold text-white">Close</Text>
        </Pressable>
      </BottomSheet>
    </View>
  );
}
