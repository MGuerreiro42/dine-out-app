import * as Linking from 'expo-linking';
import { Alert, Platform } from 'react-native';

import type { IconSpec } from '@/components/ui';

export type LinkOption = {
  icon: IconSpec;
  label: string;
  url: string;
};

export async function openExternalUrl(url: string): Promise<boolean> {
  try {
    await Linking.openURL(url);
    return true;
  } catch {
    Alert.alert("Couldn't open link", 'No app on this device can open it.');
    return false;
  }
}

function encodeGeoLabel(label: string): string {
  return encodeURIComponent(label).replace(/[()]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`);
}

export function toTelUrl(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

export function toInstagramUrl(handle: string): string {
  return `https://www.instagram.com/${handle.replace(/^@/, '')}`;
}

export async function resolveMapOptions(latitude: number, longitude: number, label: string): Promise<LinkOption[]> {
  const coords = `${latitude},${longitude}`;

  if (Platform.OS === 'android') {
    const url = `geo:0,0?q=${coords}(${encodeGeoLabel(label)})`;
    return [{ icon: { set: 'Ionicons', name: 'map-outline' }, label: 'Open in maps', url }];
  }

  if (Platform.OS === 'ios') {
    const appleMaps: LinkOption = {
      icon: { set: 'MaterialCommunityIcons', name: 'apple' },
      label: 'Apple Maps',
      url: `https://maps.apple.com/?ll=${coords}&q=${encodeURIComponent(label)}`,
    };
    const thirdParty: LinkOption[] = [
      { icon: { set: 'MaterialCommunityIcons', name: 'google-maps' }, label: 'Google Maps', url: `comgooglemaps://?q=${coords}` },
      { icon: { set: 'MaterialCommunityIcons', name: 'waze' }, label: 'Waze', url: `waze://?ll=${coords}&navigate=yes` },
    ];
    const installed = await Promise.all(thirdParty.map((option) => Linking.canOpenURL(option.url).catch(() => false)));
    return [appleMaps, ...thirdParty.filter((_, index) => installed[index])];
  }

  return [
    {
      icon: { set: 'MaterialCommunityIcons', name: 'google-maps' },
      label: 'Google Maps',
      url: `https://www.google.com/maps/search/?api=1&query=${coords}`,
    },
  ];
}
