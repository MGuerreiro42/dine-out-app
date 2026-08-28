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
    label: 'Location unavailable',
    address: 'Location unavailable',
    status: 'fallback',
    source: 'gps',
    radiusKm: 10,
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

test('marks status as denied (not fallback) when permission is denied', async () => {
  mockedLocation.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'denied' } as never);

  await useLocationStore.getState().resolveLocation();

  expect(useLocationStore.getState()).toMatchObject({ ...FALLBACK_LOCATION, status: 'denied', source: 'gps' });
  expect(mockedLocation.getCurrentPositionAsync).not.toHaveBeenCalled();
});

test('falls back when getCurrentPositionAsync times out', async () => {
  mockedLocation.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' } as never);
  mockedLocation.getCurrentPositionAsync.mockImplementation(() => new Promise(() => {}));

  await useLocationStore.getState().resolveLocation();

  expect(useLocationStore.getState().status).toBe('fallback');
}, 10000);

test('keeps the resolved coordinate with a generic label when reverseGeocodeAsync throws (e.g. unsupported on web)', async () => {
  mockedLocation.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' } as never);
  mockedLocation.getCurrentPositionAsync.mockResolvedValue({
    coords: { latitude: -22.9, longitude: -43.2 },
  } as never);
  mockedLocation.reverseGeocodeAsync.mockRejectedValue(new Error('reverseGeocodeAsync is not supported on web'));

  await useLocationStore.getState().resolveLocation();

  expect(useLocationStore.getState()).toMatchObject({
    latitude: -22.9,
    longitude: -43.2,
    label: 'Current location',
    status: 'resolved',
  });
});

test('re-resolving after a denial correctly returns to denied, not stale resolved state', async () => {
  mockedLocation.requestForegroundPermissionsAsync.mockResolvedValueOnce({ status: 'granted' } as never);
  mockedLocation.getCurrentPositionAsync.mockResolvedValueOnce({
    coords: { latitude: -22.9, longitude: -43.2 },
  } as never);
  mockedLocation.reverseGeocodeAsync.mockResolvedValueOnce([{ city: 'Rio' }] as never);
  await useLocationStore.getState().resolveLocation();
  expect(useLocationStore.getState().status).toBe('resolved');

  mockedLocation.requestForegroundPermissionsAsync.mockResolvedValueOnce({ status: 'denied' } as never);
  await useLocationStore.getState().resolveLocation();

  expect(useLocationStore.getState()).toMatchObject({ ...FALLBACK_LOCATION, status: 'denied' });
});

test('setManualLocation sets source to manual and status to resolved', async () => {
  mockedLocation.reverseGeocodeAsync.mockResolvedValue([{ street: 'Av. Paulista', district: 'Bela Vista' }] as never);

  await useLocationStore.getState().setManualLocation({ latitude: -23.56, longitude: -46.65 });

  expect(useLocationStore.getState()).toMatchObject({
    latitude: -23.56,
    longitude: -46.65,
    label: 'Av. Paulista, Bela Vista',
    status: 'resolved',
    source: 'manual',
  });
});

test('setRadiusKm updates radiusKm', () => {
  expect(useLocationStore.getState().radiusKm).toBe(10);

  useLocationStore.getState().setRadiusKm(50);

  expect(useLocationStore.getState().radiusKm).toBe(50);
});
