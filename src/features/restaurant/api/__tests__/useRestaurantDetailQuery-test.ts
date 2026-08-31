import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import React from 'react';

import { useRestaurantDetailQuery } from '@/features/restaurant/api/useRestaurantDetailQuery';
import type { RestaurantDetail as WireRestaurantDetail } from '@/lib/api';
import * as repository from '@/mocks/repository';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

const WIRE_DETAIL: WireRestaurantDetail = {
  id: 28379,
  displayName: "Habib's",
  formattedAddress: 'Rua Padre Joaquim da Soledade, São Paulo - SP',
  latitude: -23.56039437,
  longitude: -46.57715268,
  category: 'fast_food_restaurant',
  cuisineId: 'fast_food',
  photoUrl: 'https://images.unsplash.com/photo-fast-food?w=1200&q=80',
  occasion: null,
  ambient: null,
  tags: [],
  whatsapp: null,
  instagramHandle: null,
  menuItems: [],
  thingsToKnow: [],
  highlights: [],
  phones: ['+551156962828'],
  websites: ['http://www.habibs.com.br'],
  socialLinks: ['https://www.facebook.com/293209384107819'],
  categoryAlternates: ['restaurant', 'diner'],
  categoryHierarchy: ['food_and_drink', 'casual_eatery', 'fast_food_restaurant'],
  postalCode: '03190-160',
  region: 'SP',
  country: 'BR',
  brandName: "Habib's",
  brandWikidataId: null,
  reviews: [],
  averageRating: null,
  reviewCount: 0,
};

afterEach(() => {
  jest.restoreAllMocks();
});

test('threads phones, websites, socialLinks, categoryAlternates and brandName through to the domain type', async () => {
  jest.spyOn(repository, 'getPlaceDetails').mockResolvedValueOnce(WIRE_DETAIL);

  const { result } = await renderHook(() => useRestaurantDetailQuery(28379), { wrapper: createWrapper() });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));

  expect(result.current.data).toMatchObject({
    phones: ['+551156962828'],
    websites: ['http://www.habibs.com.br'],
    socialLinks: ['https://www.facebook.com/293209384107819'],
    categoryAlternates: ['restaurant', 'diner'],
    category: 'fast_food_restaurant',
    brandName: "Habib's",
    photos: ['https://images.unsplash.com/photo-fast-food?w=1200&q=80'],
  });
});

test('formats a real averageRating to one decimal and threads reviewCount/reviews through', async () => {
  const review = {
    id: 1,
    userId: 2,
    userName: 'Jane Doe',
    rating: 5,
    text: 'Great food.',
    createdAt: '2026-08-31T00:00:00.000Z',
  };
  jest.spyOn(repository, 'getPlaceDetails').mockResolvedValueOnce({
    ...WIRE_DETAIL,
    reviews: [review],
    averageRating: 4.5,
    reviewCount: 1,
  });

  const { result } = await renderHook(() => useRestaurantDetailQuery(28379), { wrapper: createWrapper() });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));

  expect(result.current.data).toMatchObject({
    rating: '4.5',
    reviewCount: 1,
    reviews: [review],
  });
});

test('leaves rating null when there is no averageRating', async () => {
  jest.spyOn(repository, 'getPlaceDetails').mockResolvedValueOnce(WIRE_DETAIL);

  const { result } = await renderHook(() => useRestaurantDetailQuery(28379), { wrapper: createWrapper() });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));

  expect(result.current.data).toMatchObject({ rating: null, reviewCount: 0, reviews: [] });
});

test('resolves null when the restaurant does not exist', async () => {
  jest.spyOn(repository, 'getPlaceDetails').mockResolvedValueOnce(null);

  const { result } = await renderHook(() => useRestaurantDetailQuery(999999), { wrapper: createWrapper() });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));

  expect(result.current.data).toBeNull();
});
