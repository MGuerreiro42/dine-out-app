import { render, screen } from '@testing-library/react-native';

import { AuthForm } from '@/features/auth/components/AuthForm';

test('shows no loading overlay when not submitting', async () => {
  await render(<AuthForm isSignup={false} onToggleMode={jest.fn()} onSubmit={jest.fn()} />);

  expect(screen.queryByText('Logging in...')).toBeNull();
  expect(screen.queryByText('Creating your account...')).toBeNull();
});

test('shows "Logging in..." while submitting in login mode', async () => {
  await render(<AuthForm isSignup={false} onToggleMode={jest.fn()} onSubmit={jest.fn()} isSubmitting />);

  expect(screen.getByText('Logging in...')).toBeTruthy();
});

test('shows "Creating your account..." while submitting in signup mode', async () => {
  await render(<AuthForm isSignup onToggleMode={jest.fn()} onSubmit={jest.fn()} isSubmitting />);

  expect(screen.getByText('Creating your account...')).toBeTruthy();
});
