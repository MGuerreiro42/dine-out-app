import { fireEvent, render, screen } from '@testing-library/react-native';

import { EmptyState } from '@/components/ui/EmptyState';

const icon = { set: 'Ionicons', name: 'heart-outline' } as const;

test('renders the title and subtitle', async () => {
  await render(<EmptyState icon={icon} title="No restaurants found near you" subtitle="Try expanding your search radius." />);

  expect(screen.getByText('No restaurants found near you')).toBeTruthy();
  expect(screen.getByText('Try expanding your search radius.')).toBeTruthy();
});

test('does not render a CTA when none is provided', async () => {
  await render(<EmptyState icon={icon} title="Title" subtitle="Subtitle" />);

  expect(screen.queryByText('Expand to 100 km')).toBeNull();
});

test('renders the CTA and fires onPress when provided', async () => {
  const onPress = jest.fn();
  await render(
    <EmptyState icon={icon} title="Title" subtitle="Subtitle" cta={{ label: 'Expand to 100 km', onPress }} />,
  );

  fireEvent.press(screen.getByText('Expand to 100 km'));

  expect(onPress).toHaveBeenCalledTimes(1);
});
