import { render, screen } from '@testing-library/react-native';

import { LoadingOverlay } from '@/components/ui/LoadingOverlay';

test('renders the label when visible', async () => {
  await render(<LoadingOverlay visible label="Logging in..." />);

  expect(screen.getByText('Logging in...')).toBeTruthy();
});

test('renders nothing visible when not visible', async () => {
  await render(<LoadingOverlay visible={false} label="Logging in..." />);

  expect(screen.queryByText('Logging in...')).toBeNull();
});
