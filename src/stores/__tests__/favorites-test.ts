import { Alert } from 'react-native';

import * as favoritesApi from '@/lib/api/favorites';
import * as secureTokenStorage from '@/lib/secureTokenStorage';
import { useAuthStore } from '@/stores/auth';
import { useFavoritesStore } from '@/stores/favorites';

afterEach(() => {
  useAuthStore.setState({ status: 'hydrating', isLoggedIn: false, user: null, accessToken: null });
  useFavoritesStore.setState({ favoriteIds: new Set() });
  jest.restoreAllMocks();
});

async function flushPromises() {
  await new Promise<void>((resolve) => setImmediate(resolve));
}

test('logout clears favorites', async () => {
  jest.spyOn(secureTokenStorage, 'getRefreshToken').mockResolvedValue(null);
  jest.spyOn(secureTokenStorage, 'clearRefreshToken').mockResolvedValue();
  useAuthStore.setState({ status: 'authenticated', isLoggedIn: true });
  useFavoritesStore.getState().setFavoriteIds([1, 2]);

  useAuthStore.getState().logout();

  expect(useFavoritesStore.getState().favoriteIds.size).toBe(0);
  await flushPromises();
});

test('auth changes other than logging out keep favorites', () => {
  useAuthStore.setState({ status: 'authenticated', isLoggedIn: true });
  useFavoritesStore.getState().setFavoriteIds([1]);

  useAuthStore.setState({ user: { id: 1, name: 'Ana', email: 'ana@example.com' } });

  expect(useFavoritesStore.getState().favoriteIds.size).toBe(1);
});

test('toggling while logged out shows the login prompt without changing state', () => {
  const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  const addSpy = jest.spyOn(favoritesApi, 'addFavorite').mockResolvedValue();

  useFavoritesStore.getState().toggleFavorite(1);

  expect(alertSpy).toHaveBeenCalledWith('Log in to save favorites', expect.any(String), expect.any(Array));
  expect(addSpy).not.toHaveBeenCalled();
  expect(useFavoritesStore.getState().favoriteIds.size).toBe(0);
});
