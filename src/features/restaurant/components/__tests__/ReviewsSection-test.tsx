import { fireEvent, render, screen } from '@testing-library/react-native';
import { Alert } from 'react-native';

import { ReviewsSection } from '@/features/restaurant/components/ReviewsSection';
import type { Review } from '@/features/restaurant/types';

const REVIEW: Review = { name: 'Ana', time: '2 days ago', rating: 5, text: 'Great food.' };

test('renders a visible empty state when there are no reviews', async () => {
  await render(<ReviewsSection rating={null} reviews={[]} reviewCount={null} />);

  expect(screen.getByText('No reviews yet')).toBeTruthy();
  expect(screen.getByText('Add a review')).toBeTruthy();
});

test('shows a coming-soon alert when "Add a review" is pressed', async () => {
  const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

  await render(<ReviewsSection rating={null} reviews={[]} reviewCount={null} />);
  await fireEvent.press(screen.getByText('Add a review'));

  expect(alertSpy).toHaveBeenCalledWith('Coming soon', expect.any(String));

  alertSpy.mockRestore();
});

test('renders the preview list when reviews exist', async () => {
  await render(<ReviewsSection rating="4.5" reviews={[REVIEW]} reviewCount={12} />);

  expect(screen.getByText('Ana')).toBeTruthy();
  expect(screen.getByText('Great food.')).toBeTruthy();
  expect(screen.queryByText('No reviews yet')).toBeNull();
});
