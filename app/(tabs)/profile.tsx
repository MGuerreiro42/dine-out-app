import { type Href, useRouter } from "expo-router";
import { ScrollView } from "react-native";

import { ErrorState, LoadingState } from "@/components/ui";
import { FavoritesRail } from "@/features/favorites/components";
import { AccountOptionsList, LoggedOutPrompt, ProfileHeader, ProfileStats } from "@/features/profile/components";
import { useCurrentUserQuery } from "@/features/profile/api";
import type { AccountOption } from "@/features/profile/types";
import { useAuthStore } from "@/stores/auth";
import { useFavoritesStore } from "@/stores/favorites";

const ACCOUNT_OPTIONS: AccountOption[] = [
  { id: "payment", label: "Payment methods" },
  { id: "notifications", label: "Notifications" },
  { id: "logout", label: "Log out", danger: true },
];

const ACCOUNT_OPTION_ROUTES: Record<string, string> = {
  payment: "/profile/payment",
  notifications: "/profile/notifications",
};

export default function ProfileScreen() {
  const router = useRouter();
  const { data: userProfile, isLoading, isError, refetch } = useCurrentUserQuery();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const logout = useAuthStore((s) => s.logout);
  const favCount = useFavoritesStore((s) => s.favoriteIds.size);

  const handleAccountOptionPress = (id: string) => {
    if (id === "logout") {
      logout();
      return;
    }
    const route = ACCOUNT_OPTION_ROUTES[id];
    if (route) {
      router.push(route as Href);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState message="Couldn't load profile." onRetry={() => refetch()} />;
  }

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 24 }}>
      <ProfileHeader isLoggedIn={isLoggedIn} userProfile={userProfile} />

      {isLoggedIn ? (
        <>
          <ProfileStats favCount={favCount} />
          <FavoritesRail />
          <AccountOptionsList options={ACCOUNT_OPTIONS} onPress={handleAccountOptionPress} />
        </>
      ) : (
        <LoggedOutPrompt
          onLogin={() => router.push("/login")}
          onExploreRestaurants={() => router.push("/")}
          onSearchOnMap={() => router.push("/search")}
          onNotificationPreferences={() => router.push("/profile/notifications")}
        />
      )}
    </ScrollView>
  );
}
