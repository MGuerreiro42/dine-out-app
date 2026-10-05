import { act, renderHook } from '@testing-library/react-native';
import * as Linking from 'expo-linking';

import { useLinkChooser } from '@/features/restaurant/hooks/useLinkChooser';
import type { LinkOption } from '@/features/restaurant/lib/externalLinks';

const A: LinkOption = { icon: { set: 'Ionicons', name: 'map-outline' }, label: 'A', url: 'https://a.example' };
const B: LinkOption = { ...A, label: 'B', url: 'https://b.example' };

afterEach(() => {
  jest.restoreAllMocks();
});

test('opens a single option directly without exposing a choice', async () => {
  const openSpy = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
  const { result } = await renderHook(() => useLinkChooser());

  await act(() => result.current.choose(() => [A]));

  expect(openSpy).toHaveBeenCalledWith(A.url);
  expect(result.current.options).toBeNull();
});

test('exposes several options for the user to choose, without opening any', async () => {
  const openSpy = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
  const { result } = await renderHook(() => useLinkChooser());

  await act(() => result.current.choose(() => [A, B]));

  expect(openSpy).not.toHaveBeenCalled();
  expect(result.current.options).toEqual([A, B]);

  await act(async () => result.current.close());
  expect(result.current.options).toBeNull();
});

test('ignores a second choose while the first is still resolving', async () => {
  const openSpy = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
  const { result } = await renderHook(() => useLinkChooser());
  let resolveFirst: (options: LinkOption[]) => void = () => {};
  const load = jest.fn(() => new Promise<LinkOption[]>((resolve) => (resolveFirst = resolve)));

  await act(async () => {
    const first = result.current.choose(load);
    result.current.choose(load);
    resolveFirst([A]);
    await first;
  });

  expect(load).toHaveBeenCalledTimes(1);
  expect(openSpy).toHaveBeenCalledTimes(1);
});
