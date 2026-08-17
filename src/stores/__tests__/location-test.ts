import * as Location from 'expo-location';

import { FALLBACK_LOCATION, useLocationStore } from '@/stores/location';

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  reverseGeocodeAsync: jest.fn(),
}));

const mockedLocation = Location as jest.Mocked<typeof Location>;

afterEach(() => {
  useLocationStore.setState({
    ...FALLBACK_LOCATION,
    label: 'Localização indisponível',
    status: 'fallback',
  });
  jest.clearAllMocks();
});

test('resolves the real device location on success', async () => {
  mockedLocation.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' } as never);
  mockedLocation.getCurrentPositionAsync.mockResolvedValue({
    coords: { latitude: -22.9, longitude: -43.2 },
  } as never);
  mockedLocation.reverseGeocodeAsync.mockResolvedValue([
    { street: 'Rua X', district: 'Copacabana' },
  ] as never);

  await useLocationStore.getState().resolveLocation();

  expect(useLocationStore.getState()).toMatchObject({
    latitude: -22.9,
    longitude: -43.2,
    label: 'Rua X, Copacabana',
    status: 'resolved',
  });
});

test('falls back when permission is denied', async () => {
  mockedLocation.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'denied' } as never);

  await useLocationStore.getState().resolveLocation();

  expect(useLocationStore.getState()).toMatchObject({ ...FALLBACK_LOCATION, status: 'fallback' });
  expect(mockedLocation.getCurrentPositionAsync).not.toHaveBeenCalled();
});

test('falls back when getCurrentPositionAsync times out', async () => {
  mockedLocation.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' } as never);
  mockedLocation.getCurrentPositionAsync.mockImplementation(() => new Promise(() => {}));

  await useLocationStore.getState().resolveLocation();

  expect(useLocationStore.getState().status).toBe('fallback');
}, 10000);

test('falls back when reverseGeocodeAsync throws', async () => {
  mockedLocation.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' } as never);
  mockedLocation.getCurrentPositionAsync.mockResolvedValue({
    coords: { latitude: -22.9, longitude: -43.2 },
  } as never);
  mockedLocation.reverseGeocodeAsync.mockRejectedValue(new Error('geocode failed'));

  await useLocationStore.getState().resolveLocation();

  expect(useLocationStore.getState().status).toBe('fallback');
});

test('re-resolving after a denial correctly returns to fallback, not stale resolved state', async () => {
  mockedLocation.requestForegroundPermissionsAsync.mockResolvedValueOnce({ status: 'granted' } as never);
  mockedLocation.getCurrentPositionAsync.mockResolvedValueOnce({
    coords: { latitude: -22.9, longitude: -43.2 },
  } as never);
  mockedLocation.reverseGeocodeAsync.mockResolvedValueOnce([{ city: 'Rio' }] as never);
  await useLocationStore.getState().resolveLocation();
  expect(useLocationStore.getState().status).toBe('resolved');

  mockedLocation.requestForegroundPermissionsAsync.mockResolvedValueOnce({ status: 'denied' } as never);
  await useLocationStore.getState().resolveLocation();

  expect(useLocationStore.getState()).toMatchObject({ ...FALLBACK_LOCATION, status: 'fallback' });
});
