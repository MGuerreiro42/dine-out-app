import { router } from 'expo-router';
import { Alert } from 'react-native';
import { create } from 'zustand';

import { addFavorite, removeFavorite } from '@/mocks/repository';
import { useAuthStore } from '@/stores/auth';

type FavoritesStore = {
  favoriteIds: Set<number>;
  setFavoriteIds: (ids: number[]) => void;
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
};

export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
  favoriteIds: new Set(),

  setFavoriteIds: (ids) => set({ favoriteIds: new Set(ids) }),

  toggleFavorite: (id) => {
    if (!useAuthStore.getState().isLoggedIn) {
      Alert.alert('Log in to save favorites', 'Create an account or log in to save restaurants for later.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log in', onPress: () => router.push('/login') },
      ]);
      return;
    }

    const wasFavorite = get().favoriteIds.has(id);
    const optimisticValue = !wasFavorite;

    set((state) => {
      const next = new Set(state.favoriteIds);
      if (optimisticValue) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return { favoriteIds: next };
    });

    const request = wasFavorite ? removeFavorite(id) : addFavorite(id);
    request.catch(() => {
      set((state) => {
        if (state.favoriteIds.has(id) !== optimisticValue) {
          return state;
        }
        const next = new Set(state.favoriteIds);
        if (wasFavorite) {
          next.add(id);
        } else {
          next.delete(id);
        }
        return { favoriteIds: next };
      });
    });
  },

  isFavorite: (id) => get().favoriteIds.has(id),
}));
