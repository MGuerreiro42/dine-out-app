import { fireEvent, render, screen } from '@testing-library/react-native';
import { Alert } from 'react-native';

import { InfoActionsRow } from '@/features/restaurant/components/InfoActionsRow';

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders nothing when there is no contact info at all', async () => {
  const { toJSON } = await render(
    <InfoActionsRow phones={[]} whatsapp={null} instagramHandle={null} websites={[]} socialLinks={[]} />,
  );

  expect(toJSON()).toBeNull();
});

test('lists every phone, website and social link inline, no sheet required', async () => {
  await render(
    <InfoActionsRow
      phones={['+551156962828', '+551199998888']}
      whatsapp={null}
      instagramHandle={null}
      websites={['http://www.habibs.com.br']}
      socialLinks={['https://www.facebook.com/293209384107819']}
    />,
  );

  expect(screen.getByText('Contact & socials')).toBeTruthy();
  expect(screen.getByText('Call: +551156962828')).toBeTruthy();
  expect(screen.getByText('Call: +551199998888')).toBeTruthy();
  expect(screen.getByText('Website: habibs.com.br')).toBeTruthy();
  expect(screen.getByText('Facebook')).toBeTruthy();
});

test('shows a demo redirect alert when a contact option is pressed', async () => {
  const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

  await render(
    <InfoActionsRow
      phones={['+551156962828']}
      whatsapp={null}
      instagramHandle={null}
      websites={[]}
      socialLinks={[]}
    />,
  );
  await fireEvent.press(screen.getByText('Call: +551156962828'));

  expect(alertSpy).toHaveBeenCalledWith('Demo', 'Would redirect to Call: +551156962828');
});
