import { useMemo } from 'react';

import type { GeoPoint } from '@/lib/geo';
import { useLocationStore } from '@/stores/location';

export function useLocationOrigin(): GeoPoint | null {
  const status = useLocationStore((s) => s.status);
  const latitude = useLocationStore((s) => s.latitude);
  const longitude = useLocationStore((s) => s.longitude);

  return useMemo(
    () => (status === 'resolved' ? { latitude, longitude } : null),
    [status, latitude, longitude],
  );
}
