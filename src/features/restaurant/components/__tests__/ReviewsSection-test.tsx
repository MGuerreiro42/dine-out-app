import { fireEvent, render, screen } from '@testing-library/react-native';
import { Alert } from 'react-native';

import { ReviewsSection } from '@/features/restaurant/components/ReviewsSection';
import type { Review } from '@/features/restaurant/types';
import { useAuthStore } from '@/stores/auth';

const REVIEW: Review = {
  id: 1,
  userId: 1,
  userName: 'Ana',
  rating: 5,
  text: 'Great food.',
  createdAt: '2026-08-31T00:00:00.000Z',
};

test('renders a visible empty state when there are no reviews', async () => {
  await render(<ReviewsSection rating={null} reviews={[]} reviewCount={null} onAddReview={jest.fn()} />);

  expect(screen.getByText('No reviews yet')).toBeTruthy();
  expect(screen.getByText('Add a review')).toBeTruthy();
});

test('prompts to log in instead of opening the form when logged out', async () => {
  useAuthStore.setState({ isLoggedIn: false });
  const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  const onAddReview = jest.fn();

  await render(<ReviewsSection rating={null} reviews={[]} reviewCount={null} onAddReview={onAddReview} />);
  await fireEvent.press(screen.getByText('Add a review'));

  expect(alertSpy).toHaveBeenCalledWith('Log in to leave a review', expect.any(String), expect.any(Array));
  expect(onAddReview).not.toHaveBeenCalled();

  alertSpy.mockRestore();
});

test('calls onAddReview when logged in', async () => {
  useAuthStore.setState({ isLoggedIn: true });
  const onAddReview = jest.fn();

  await render(<ReviewsSection rating={null} reviews={[]} reviewCount={null} onAddReview={onAddReview} />);
  await fireEvent.press(screen.getByText('Add a review'));

  expect(onAddReview).toHaveBeenCalledTimes(1);
});

test('renders the preview list when reviews exist', async () => {
  await render(<ReviewsSection rating="4.5" reviews={[REVIEW]} reviewCount={12} onAddReview={jest.fn()} />);

  expect(screen.getByText('Ana')).toBeTruthy();
  expect(screen.getByText('Great food.')).toBeTruthy();
  expect(screen.queryByText('No reviews yet')).toBeNull();
});
