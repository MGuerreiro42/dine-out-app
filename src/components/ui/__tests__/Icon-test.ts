import { type IconSpec, toIconSpec } from '@/components/ui/Icon';

const FALLBACK: IconSpec = { set: 'Ionicons', name: 'sparkles' };

test('passes through a name that exists in its icon set', () => {
  expect(toIconSpec({ set: 'MaterialCommunityIcons', name: 'grill' }, FALLBACK)).toEqual({
    set: 'MaterialCommunityIcons',
    name: 'grill',
  });
});

test('returns the fallback for a name missing from its icon set', () => {
  expect(toIconSpec({ set: 'Ionicons', name: 'not-a-real-glyph' }, FALLBACK)).toBe(FALLBACK);
});
