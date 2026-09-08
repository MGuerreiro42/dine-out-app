import { create } from 'zustand';

import { AuthUserSchema } from '@/lib/api';
import type { AuthUser } from '@/lib/api';
import { apiGet, setAccessToken as setApiAccessToken, setSessionExpiredHandler } from '@/lib/apiClient';
import { clearRefreshToken, getRefreshToken, setRefreshToken } from '@/lib/secureTokenStorage';
import { logoutSession, refreshSession } from '@/mocks/repository';
import { useFavoritesStore } from '@/stores/favorites';

export type { AuthUser };

type AuthStatus = 'hydrating' | 'authenticated' | 'guest';

type AuthState = {
  status: AuthStatus;
  isLoggedIn: boolean;
  user: AuthUser | null;
  accessToken: string | null;
  bootstrap: () => Promise<void>;
  setSession: (session: { accessToken: string; refreshToken: string; user: AuthUser }) => Promise<void>;
  logout: () => void;
};

function clearLocalSession(): void {
  setApiAccessToken(null);
  useFavoritesStore.getState().setFavoriteIds([]);
}

export const useAuthStore = create<AuthState>((set) => ({
  status: 'hydrating',
  isLoggedIn: false,
  user: null,
  accessToken: null,

  bootstrap: async () => {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      set({ status: 'guest', isLoggedIn: false, user: null, accessToken: null });
      return;
    }

    try {
      const tokens = await refreshSession(refreshToken);
      setApiAccessToken(tokens.accessToken);
      await setRefreshToken(tokens.refreshToken);
      const user = AuthUserSchema.parse(await apiGet('/users/me'));
      set({ status: 'authenticated', isLoggedIn: true, user, accessToken: tokens.accessToken });
    } catch {
      await clearRefreshToken();
      clearLocalSession();
      set({ status: 'guest', isLoggedIn: false, user: null, accessToken: null });
    }
  },

  setSession: async (session) => {
    setApiAccessToken(session.accessToken);
    await setRefreshToken(session.refreshToken);
    set({ status: 'authenticated', isLoggedIn: true, user: session.user, accessToken: session.accessToken });
  },

  logout: () => {
    const pendingRefreshToken = getRefreshToken();
    useFavoritesStore.getState().setFavoriteIds([]);
    set({ status: 'guest', isLoggedIn: false, user: null, accessToken: null });

    pendingRefreshToken.then(async (refreshToken) => {
      if (refreshToken) {
        await logoutSession(refreshToken).catch(() => {});
      }
      await clearRefreshToken();
      setApiAccessToken(null);
    });
  },
}));

setSessionExpiredHandler(() => {
  clearRefreshToken();
  clearLocalSession();
  useAuthStore.setState({ status: 'guest', isLoggedIn: false, user: null, accessToken: null });
});
