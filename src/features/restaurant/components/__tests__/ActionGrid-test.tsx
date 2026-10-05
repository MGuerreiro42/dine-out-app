import { fireEvent, render, screen } from '@testing-library/react-native';
import * as Linking from 'expo-linking';

import { ActionGrid } from '@/features/restaurant/components/ActionGrid';
import type { DeliveryLink } from '@/features/restaurant/types';

const IFOOD: DeliveryLink = { platform: 'ifood', url: 'https://www.ifood.com.br/delivery/sao-paulo-sp/habibs' };
const RAPPI: DeliveryLink = { platform: 'rappi', url: 'https://www.rappi.com.br/restaurantes/habibs' };

afterEach(() => {
  jest.restoreAllMocks();
});

test('Delivery and Takeaway stay disabled without delivery links', async () => {
  const openSpy = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);

  await render(<ActionGrid menu={[]} deliveryLinks={[]} />);
  await fireEvent.press(screen.getByText('Delivery'));
  await fireEvent.press(screen.getByText('Takeaway'));

  expect(openSpy).not.toHaveBeenCalled();
});

test('Delivery and Takeaway both open the only delivery link directly', async () => {
  const openSpy = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);

  await render(<ActionGrid menu={[]} deliveryLinks={[IFOOD]} />);
  await fireEvent.press(screen.getByText('Delivery'));
  await fireEvent.press(screen.getByText('Takeaway'));

  expect(openSpy).toHaveBeenNthCalledWith(1, IFOOD.url);
  expect(openSpy).toHaveBeenNthCalledWith(2, IFOOD.url);
  expect(screen.queryByText('Order from')).toBeNull();
});

test('Delivery with several links opens a platform chooser that opens the selected link', async () => {
  const openSpy = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);

  await render(<ActionGrid menu={[]} deliveryLinks={[IFOOD, RAPPI]} />);
  await fireEvent.press(screen.getByText('Delivery'));

  expect(openSpy).not.toHaveBeenCalled();
  expect(screen.getByText('iFood')).toBeTruthy();

  await fireEvent.press(screen.getByText('Rappi'));

  expect(openSpy).toHaveBeenCalledWith(RAPPI.url);
  expect(screen.queryByText('Order from')).toBeNull();
});
