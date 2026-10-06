import { fireEvent, render, screen } from '@testing-library/react-native';
import * as Linking from 'expo-linking';

import { InfoActionsRow } from '@/features/restaurant/components/InfoActionsRow';

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders all four cards, with real data even when only some channels are present', async () => {
  await render(
    <InfoActionsRow
      phones={['+551156962828']}
      whatsappUrl={null}
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

test.each([
  ['Phone', 'tel:+551156962828'],
  ['Website', 'http://www.habibs.com.br'],
  ['Instagram', 'https://www.instagram.com/somerestaurant'],
  ['WhatsApp', 'https://wa.me/5511956962828'],
])('pressing the %s card opens %s', async (label, url) => {
  const openSpy = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);

  await render(
    <InfoActionsRow
      phones={['+55 11 5696-2828']}
      whatsappUrl="https://wa.me/5511956962828"
      instagramHandle="somerestaurant"
      websites={['http://www.habibs.com.br']}
      socialLinks={['https://www.facebook.com/293209384107819']}
    />,
  );
  await fireEvent.press(screen.getByText(label));

  expect(openSpy).toHaveBeenCalledWith(url);
});

test('falls back to the first social link when there is no Instagram handle', async () => {
  const openSpy = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);

  await render(
    <InfoActionsRow
      phones={[]}
      whatsappUrl={null}
      instagramHandle={null}
      websites={[]}
      socialLinks={['https://www.facebook.com/293209384107819']}
    />,
  );
  await fireEvent.press(screen.getByText('Facebook'));

  expect(openSpy).toHaveBeenCalledWith('https://www.facebook.com/293209384107819');
});

test('does not respond to a press on a card with no data', async () => {
  const openSpy = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);

  await render(<InfoActionsRow phones={[]} whatsappUrl={null} instagramHandle={null} websites={[]} socialLinks={[]} />);
  await fireEvent.press(screen.getByText('Phone'));

  expect(openSpy).not.toHaveBeenCalled();
});
