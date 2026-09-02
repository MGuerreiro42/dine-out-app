import { type Href, useRouter } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

import { Icon, type IconSpec } from "@/components/ui";
import { colors, iconSize } from "@/theme";
import { useAuthStore } from "@/stores/auth";

const NAV_ITEMS: { label: string; icon: IconSpec; route: string }[] = [
  { label: "Home", icon: { set: "Ionicons", name: "home-outline" }, route: "/" },
  { label: "Search", icon: { set: "Ionicons", name: "search-outline" }, route: "/search" },
  { label: "Categories", icon: { set: "Ionicons", name: "grid-outline" }, route: "/category" },
  { label: "Favorites", icon: { set: "Ionicons", name: "heart-outline" }, route: "/profile" },
  {
    label: "Notifications",
    icon: { set: "Ionicons", name: "notifications-outline" },
    route: "/profile/notifications",
  },
];

export function SideMenu() {
  const router = useRouter();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);
  const goTo = (route: string) => {
    close();
    router.push(route as Href);
  };

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        className="h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-sand-light"
      >
        <Icon spec={{ set: "Ionicons", name: "person-outline" }} color={colors.ink} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={close}>
        <Pressable onPress={close} className="flex-1 flex-row bg-black/35">
          <Pressable onPress={(e) => e.stopPropagation()} className="h-full w-[82%] bg-white p-md2">
            <View className="mb-md flex-row items-center justify-between">
              <Pressable onPress={close} className="h-8 w-8 items-center justify-center rounded-full bg-sand">
                <Icon spec={{ set: "Ionicons", name: "chevron-back" }} size={iconSize.inline} />
              </Pressable>
              <Pressable onPress={close} className="h-8 w-8 items-center justify-center rounded-full bg-sand">
                <Icon spec={{ set: "Ionicons", name: "close" }} size={iconSize.inline} />
              </Pressable>
            </View>

            {isLoggedIn && user ? (
              <Pressable onPress={() => goTo("/profile")} className="mb-lg flex-row items-center gap-sm2">
                <View className="h-12 w-12 items-center justify-center rounded-full bg-accent-tint">
                  <Text className="text-base font-bold text-accent">{user.name.charAt(0).toUpperCase()}</Text>
                </View>
                <View>
                  <Text className="text-sm font-bold text-ink">{user.name}</Text>
                  <Text className="text-caption text-muted">View profile</Text>
                </View>
              </Pressable>
            ) : (
              <Pressable onPress={() => goTo("/login")} className="mb-lg items-center rounded-lg bg-ink py-md">
                <Text className="text-body font-bold text-white">Log in or sign up</Text>
              </Pressable>
            )}

            <View className="gap-xs">
              {NAV_ITEMS.map((item) => (
                <Pressable
                  key={item.label}
                  onPress={() => goTo(item.route)}
                  className="flex-row items-center gap-md border-b border-sand py-md"
                >
                  <Icon spec={item.icon} />
                  <Text className="text-sm font-bold text-ink">{item.label}</Text>
                </Pressable>
              ))}
            </View>

            {isLoggedIn ? (
              <Pressable onPress={logout} className="mt-auto py-md">
                <Text className="text-sm font-bold text-danger">Log out</Text>
              </Pressable>
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
