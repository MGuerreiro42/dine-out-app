import { fireEvent, render, screen } from '@testing-library/react-native';

import { InfoActionsRow } from '@/features/restaurant/components/InfoActionsRow';

test('renders nothing when there is no contact info at all', async () => {
  const { toJSON } = await render(
    <InfoActionsRow phones={[]} whatsapp={null} instagramHandle={null} websites={[]} socialLinks={[]} />,
  );

  expect(toJSON()).toBeNull();
});

test('lists every phone, website and social link once the sheet is opened', async () => {
  await render(
    <InfoActionsRow
      phones={['+551156962828', '+551199998888']}
      whatsapp={null}
      instagramHandle={null}
      websites={['http://www.habibs.com.br']}
      socialLinks={['https://www.facebook.com/293209384107819']}
    />,
  );

  await fireEvent.press(screen.getByText('Contact & socials'));

  expect(screen.getByText('Call: +551156962828')).toBeTruthy();
  expect(screen.getByText('Call: +551199998888')).toBeTruthy();
  expect(screen.getByText('Website: habibs.com.br')).toBeTruthy();
  expect(screen.getByText('Facebook')).toBeTruthy();
});
