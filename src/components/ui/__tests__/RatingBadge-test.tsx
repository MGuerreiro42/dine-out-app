import { render, screen } from '@testing-library/react-native';

import { RatingBadge } from '@/components/ui/RatingBadge';

test('renders the rating and price level', async () => {
  await render(<RatingBadge rating="4.8" priceLevel="$$$" />);

  expect(screen.getByText('4.8 · $$$')).toBeTruthy();
});
