const EARTH_RADIUS_KM = 6371;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export type GeoPoint = { latitude: number; longitude: number };

export function distanceKmFrom(origin: GeoPoint | null, target: GeoPoint): number | null {
  if (!origin) {
    return null;
  }
  return haversineKm(origin.latitude, origin.longitude, target.latitude, target.longitude);
}

export function formatDistanceKm(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

export function distanceLabelFrom(origin: GeoPoint | null, target: GeoPoint): string | null {
  const km = distanceKmFrom(origin, target);
  return km === null ? null : formatDistanceKm(km);
}
