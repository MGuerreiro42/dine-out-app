import * as Location from 'expo-location';
import { create } from 'zustand';

export const FALLBACK_LOCATION = { latitude: -23.561, longitude: -46.656 };
const FALLBACK_LABEL = 'Location unavailable';
const GENERIC_RESOLVED_LABEL = 'Current location';
const LOCATION_TIMEOUT_MS = 5000;
const DEFAULT_RADIUS_KM = 10;

type LocationStatus = 'resolved' | 'fallback' | 'denied';
type LocationSource = 'gps' | 'manual';

type LocationState = {
  latitude: number;
  longitude: number;
  label: string;
  address: string;
  status: LocationStatus;
  source: LocationSource;
  radiusKm: number;
  resolveLocation: () => Promise<void>;
  setManualLocation: (coords: { latitude: number; longitude: number }) => Promise<void>;
  setRadiusKm: (km: number) => void;
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

function formatAddress(address: Location.LocationGeocodedAddress): string {
  const line = [address.street, address.district, address.city].filter(Boolean).join(', ');
  return line || formatLabel(address);
}

async function reverseGeocode(latitude: number, longitude: number): Promise<{ label: string; address: string }> {
  try {
    const [address] = await withTimeout(Location.reverseGeocodeAsync({ latitude, longitude }), LOCATION_TIMEOUT_MS);
    if (address) {
      return { label: formatLabel(address), address: formatAddress(address) };
    }
  } catch {
    return { label: GENERIC_RESOLVED_LABEL, address: GENERIC_RESOLVED_LABEL };
  }
  return { label: GENERIC_RESOLVED_LABEL, address: GENERIC_RESOLVED_LABEL };
}

export const useLocationStore = create<LocationState>((set) => ({
  latitude: FALLBACK_LOCATION.latitude,
  longitude: FALLBACK_LOCATION.longitude,
  label: FALLBACK_LABEL,
  address: FALLBACK_LABEL,
  status: 'fallback',
  source: 'gps',
  radiusKm: DEFAULT_RADIUS_KM,
  resolveLocation: async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        set({ ...FALLBACK_LOCATION, label: FALLBACK_LABEL, address: FALLBACK_LABEL, status: 'denied', source: 'gps' });
        return;
      }

      const position = await withTimeout(Location.getCurrentPositionAsync({}), LOCATION_TIMEOUT_MS);
      const { label, address } = await reverseGeocode(position.coords.latitude, position.coords.longitude);

      set({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        label,
        address,
        status: 'resolved',
        source: 'gps',
      });
    } catch {
      set({ ...FALLBACK_LOCATION, label: FALLBACK_LABEL, address: FALLBACK_LABEL, status: 'fallback', source: 'gps' });
    }
  },
  setManualLocation: async ({ latitude, longitude }) => {
    const { label, address } = await reverseGeocode(latitude, longitude);
    set({ latitude, longitude, label, address, status: 'resolved', source: 'manual' });
  },
  setRadiusKm: (km) => set({ radiusKm: km }),
}));
