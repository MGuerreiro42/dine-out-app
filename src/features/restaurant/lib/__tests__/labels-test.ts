import { getSocialLinkIcon, getSocialLinkLabel, getWebsiteLabel, humanizeCategory } from '@/features/restaurant/lib/labels';

test('humanizeCategory title-cases a snake_case value', () => {
  expect(humanizeCategory('sandwich_shop')).toBe('Sandwich Shop');
  expect(humanizeCategory('restaurant')).toBe('Restaurant');
});

test('getSocialLinkLabel maps known hostnames to a platform name', () => {
  expect(getSocialLinkLabel('https://www.facebook.com/293209384107819')).toBe('Facebook');
  expect(getSocialLinkLabel('https://instagram.com/someplace')).toBe('Instagram');
});

test('getSocialLinkLabel falls back to the bare hostname for unknown platforms', () => {
  expect(getSocialLinkLabel('https://www.tiktok.com/@someplace')).toBe('tiktok.com');
});

test('getSocialLinkLabel falls back to Website for an unparsable url', () => {
  expect(getSocialLinkLabel('not a url')).toBe('Website');
});

test('getSocialLinkIcon returns platform-specific icons for known hostnames', () => {
  expect(getSocialLinkIcon('https://www.facebook.com/x')).toEqual({ set: 'Ionicons', name: 'logo-facebook' });
  expect(getSocialLinkIcon('https://instagram.com/x')).toEqual({ set: 'Ionicons', name: 'logo-instagram' });
  expect(getSocialLinkIcon('https://www.tiktok.com/x')).toEqual({ set: 'Ionicons', name: 'share-social-outline' });
});

test('getWebsiteLabel strips the protocol and www prefix', () => {
  expect(getWebsiteLabel('http://www.habibs.com.br')).toBe('habibs.com.br');
});
