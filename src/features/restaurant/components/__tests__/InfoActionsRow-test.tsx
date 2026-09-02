import { fireEvent, render, screen } from '@testing-library/react-native';
import { Alert } from 'react-native';

import { InfoActionsRow } from '@/features/restaurant/components/InfoActionsRow';

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders all four cards, with real data even when only some channels are present', async () => {
  await render(
    <InfoActionsRow
      phones={['+551156962828']}
      whatsapp={null}
      instagramHandle={null}
      websites={['http://www.habibs.com.br']}
      socialLinks={['https://www.facebook.com/293209384107819']}
    />,
  );

  expect(screen.getByText('Phone')).toBeTruthy();
  expect(screen.getByText('+551156962828')).toBeTruthy();
  expect(screen.getByText('Website')).toBeTruthy();
  expect(screen.getByText('habibs.com.br')).toBeTruthy();
  expect(screen.getByText('Facebook')).toBeTruthy();
  expect(screen.getByText('WhatsApp')).toBeTruthy();
  expect(screen.getByText('Not provided')).toBeTruthy();
});

test('prefers Instagram over a generic social link for the Social card', async () => {
  await render(
    <InfoActionsRow
      phones={[]}
      whatsapp={null}
      instagramHandle="somerestaurant"
      websites={[]}
      socialLinks={['https://www.facebook.com/293209384107819']}
    />,
  );

  expect(screen.getByText('Instagram')).toBeTruthy();
  expect(screen.getByText('somerestaurant')).toBeTruthy();
});

test('shows a demo redirect alert when a card with real data is pressed', async () => {
  const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

  await render(
    <InfoActionsRow phones={['+551156962828']} whatsapp={null} instagramHandle={null} websites={[]} socialLinks={[]} />,
  );
  await fireEvent.press(screen.getByText('Phone'));

  expect(alertSpy).toHaveBeenCalledWith('Demo', 'Would redirect to Phone: +551156962828');
});

test('does not respond to a press on a card with no data', async () => {
  const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

  await render(
    <InfoActionsRow phones={[]} whatsapp={null} instagramHandle={null} websites={[]} socialLinks={[]} />,
  );
  await fireEvent.press(screen.getByText('Phone'));

  expect(alertSpy).not.toHaveBeenCalled();
});
