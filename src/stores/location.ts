import * as Location from 'expo-location';
import { create } from 'zustand';

export const FALLBACK_LOCATION = { latitude: -23.561, longitude: -46.656 };
const FALLBACK_LABEL = 'Localização indisponível';
const LOCATION_TIMEOUT_MS = 5000;

type LocationStatus = 'resolved' | 'fallback';

type LocationState = {
  latitude: number;
  longitude: number;
  label: string;
  status: LocationStatus;
  resolveLocation: () => Promise<void>;
};

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Location request timed out')), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

function formatLabel(address: Location.LocationGeocodedAddress): string {
  const line = [address.street, address.district ?? address.city].filter(Boolean).join(', ');
  return line || address.city || address.region || FALLBACK_LABEL;
}

export const useLocationStore = create<LocationState>((set) => ({
  latitude: FALLBACK_LOCATION.latitude,
  longitude: FALLBACK_LOCATION.longitude,
  label: FALLBACK_LABEL,
  status: 'fallback',
  resolveLocation: async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        set({ ...FALLBACK_LOCATION, label: FALLBACK_LABEL, status: 'fallback' });
        return;
      }

      const position = await withTimeout(Location.getCurrentPositionAsync({}), LOCATION_TIMEOUT_MS);
      const [address] = await withTimeout(
        Location.reverseGeocodeAsync({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
        LOCATION_TIMEOUT_MS,
      );

      set({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        label: address ? formatLabel(address) : FALLBACK_LABEL,
        status: 'resolved',
      });
    } catch {
      set({ ...FALLBACK_LOCATION, label: FALLBACK_LABEL, status: 'fallback' });
    }
  },
}));
