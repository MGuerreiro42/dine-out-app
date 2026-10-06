import { act, render, screen } from '@testing-library/react-native';

import { RestaurantCard } from '@/components/ui/RestaurantCard';
import { FALLBACK_LOCATION, useLocationStore } from '@/stores/location';
import type { Restaurant } from '@/types';

const RESTAURANT: Restaurant = {
  id: 1,
  name: 'Fogo & Brasa',
  photo: null,
  rating: null,
  priceLevel: null,
  cuisine: 'brazilian',
  category: 'brazilian_restaurant',
  occasion: null,
  ambient: null,
  latitude: FALLBACK_LOCATION.latitude + 0.02,
  longitude: FALLBACK_LOCATION.longitude,
  reviewCount: null,
  brandName: null,
  websites: [],
};

afterEach(() => {
  useLocationStore.setState({ ...FALLBACK_LOCATION, status: 'fallback', source: 'gps' });
});

test('hides the distance chip while the location is a fallback', async () => {
  await render(<RestaurantCard restaurant={RESTAURANT} onPress={jest.fn()} />);

  expect(screen.queryByText(/km$/)).toBeNull();
});

test('shows the distance chip once the location resolves', async () => {
  await render(<RestaurantCard restaurant={RESTAURANT} onPress={jest.fn()} />);

  await act(async () => {
    useLocationStore.setState({ status: 'resolved', source: 'manual' });
  });

  expect(screen.getByText('2.2 km')).toBeTruthy();
});
