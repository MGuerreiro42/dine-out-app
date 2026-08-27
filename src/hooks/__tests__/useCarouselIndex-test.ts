import { act, renderHook } from '@testing-library/react-native';

import { useCarouselIndex } from '@/hooks/useCarouselIndex';

test('goNext and goPrev wrap around the list length', async () => {
  const { result } = await renderHook(() => useCarouselIndex(3, 0));

  await act(async () => result.current.goNext());
  expect(result.current.index).toBe(1);

  await act(async () => result.current.goPrev());
  await act(async () => result.current.goPrev());
  expect(result.current.index).toBe(2);
});

test('resets index to 0 when the list shrinks below the current index', async () => {
  const { result, rerender } = await renderHook(({ length }: { length: number }) => useCarouselIndex(length, 0), {
    initialProps: { length: 3 },
  });

  await act(async () => result.current.setIndex(2));
  expect(result.current.index).toBe(2);

  await act(async () => rerender({ length: 2 }));
  expect(result.current.index).toBe(0);
});

test('auto-advances on an interval when there is more than one item', async () => {
  jest.useFakeTimers();

  const { result } = await renderHook(() => useCarouselIndex(3, 1000));

  await act(async () => jest.advanceTimersByTime(1000));
  expect(result.current.index).toBe(1);

  await act(async () => jest.advanceTimersByTime(2000));
  expect(result.current.index).toBe(0);

  jest.useRealTimers();
});

test('does not start a timer for zero or one item', async () => {
  jest.useFakeTimers();

  const { result } = await renderHook(() => useCarouselIndex(1, 1000));

  await act(async () => jest.advanceTimersByTime(5000));
  expect(result.current.index).toBe(0);

  jest.useRealTimers();
});
