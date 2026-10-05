import * as Linking from 'expo-linking';
import { Alert, Platform } from 'react-native';

import { openExternalUrl, resolveMapOptions, toInstagramUrl, toTelUrl } from '@/features/restaurant/lib/externalLinks';

const originalOS = Platform.OS;

function setPlatform(os: typeof Platform.OS) {
  Object.defineProperty(Platform, 'OS', { value: os, configurable: true });
}

afterEach(() => {
  jest.restoreAllMocks();
  setPlatform(originalOS);
});

test('openExternalUrl shows an alert when no app can open the url', async () => {
  jest.spyOn(Linking, 'openURL').mockRejectedValueOnce(new Error('No activity'));
  const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

  expect(await openExternalUrl('waze://?ll=1,2')).toBe(false);
  expect(alertSpy).toHaveBeenCalledWith("Couldn't open link", 'No app on this device can open it.');
});

test('toTelUrl strips formatting but keeps the leading +', () => {
  expect(toTelUrl('+55 (11) 5696-2828')).toBe('tel:+551156962828');
});

test('toInstagramUrl strips a leading @', () => {
  expect(toInstagramUrl('@somerestaurant')).toBe('https://www.instagram.com/somerestaurant');
  expect(toInstagramUrl('somerestaurant')).toBe('https://www.instagram.com/somerestaurant');
});

test('resolveMapOptions returns a single geo: url on Android', async () => {
  setPlatform('android');

  const options = await resolveMapOptions(-23.5, -46.6, 'Bar (Centro)');

  expect(options.map((o) => o.url)).toEqual(['geo:0,0?q=-23.5,-46.6(Bar%20%28Centro%29)']);
});

test('resolveMapOptions on iOS always offers Apple Maps plus only the third-party apps it can confirm are installed', async () => {
  setPlatform('ios');
  jest.spyOn(Linking, 'canOpenURL').mockImplementation(async (url) => {
    if (url.startsWith('comgooglemaps://')) {
      throw new Error('scheme not allowlisted');
    }
    return url.startsWith('waze://');
  });

  const options = await resolveMapOptions(-23.5, -46.6, 'Bar');

  expect(options.map((o) => o.label)).toEqual(['Apple Maps', 'Waze']);
  expect(options[1]?.url).toBe('waze://?ll=-23.5,-46.6&navigate=yes');
});

test('resolveMapOptions on web returns a Google Maps search url', async () => {
  setPlatform('web');

  const options = await resolveMapOptions(-23.5, -46.6, 'Bar');

  expect(options.map((o) => o.url)).toEqual(['https://www.google.com/maps/search/?api=1&query=-23.5,-46.6']);
});
