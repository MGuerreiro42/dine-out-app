import { render, screen } from '@testing-library/react-native';

import { RatingBadge } from '@/components/ui/RatingBadge';

test('renders the rating and price level', async () => {
  await render(<RatingBadge rating="4.8" priceLevel="$$$" />);

  expect(screen.getByText('4.8 · $$$')).toBeTruthy();
});

test('renders nothing when both rating and price level are null', async () => {
  const { toJSON } = await render(<RatingBadge rating={null} priceLevel={null} />);

  expect(toJSON()).toBeNull();
});

test('renders only the rating when price level is null', async () => {
  await render(<RatingBadge rating="4.8" priceLevel={null} />);

  expect(screen.getByText('4.8')).toBeTruthy();
});
