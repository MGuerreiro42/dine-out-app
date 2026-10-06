import { apiGet } from '@/lib/apiClient';

const originalDev = __DEV__;
const originalBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

afterEach(() => {
  (globalThis as unknown as { __DEV__: boolean }).__DEV__ = originalDev;
  if (originalBaseUrl === undefined) {
    delete process.env.EXPO_PUBLIC_API_BASE_URL;
  } else {
    process.env.EXPO_PUBLIC_API_BASE_URL = originalBaseUrl;
  }
});

test('rejects requests outside dev when EXPO_PUBLIC_API_BASE_URL is unset', async () => {
  (globalThis as unknown as { __DEV__: boolean }).__DEV__ = false;
  delete process.env.EXPO_PUBLIC_API_BASE_URL;
  const fetchSpy = jest.spyOn(globalThis, 'fetch');

  await expect(apiGet('/restaurants')).rejects.toThrow('EXPO_PUBLIC_API_BASE_URL is not set');
  expect(fetchSpy).not.toHaveBeenCalled();

  fetchSpy.mockRestore();
});
