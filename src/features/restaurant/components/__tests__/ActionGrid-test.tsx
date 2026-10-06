import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import * as Linking from 'expo-linking';
import { Alert, type AlertButton } from 'react-native';

import { ActionGrid } from '@/features/restaurant/components/ActionGrid';
import type { DeliveryLink } from '@/features/restaurant/types';

const IFOOD: DeliveryLink = { platform: 'ifood', url: 'https://www.ifood.com.br/delivery/sao-paulo-sp/habibs' };
const RAPPI: DeliveryLink = { platform: 'rappi', url: 'https://www.rappi.com.br/restaurantes/habibs' };
const NEAR_KM = 2;
const FAR_KM = 32.4;

function pressAlertButton(alertSpy: jest.SpyInstance, text: string) {
  const buttons = alertSpy.mock.calls[0][2] as AlertButton[];
  const button = buttons.find((candidate) => candidate.text === text);
  if (!button?.onPress) {
    throw new Error(`No alert button "${text}"`);
  }
  return act(async () => {
    button.onPress?.();
  });
}

afterEach(() => {
  jest.restoreAllMocks();
});

test('Delivery and Takeaway stay disabled without delivery links', async () => {
  const openSpy = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);

  await render(<ActionGrid menu={[]} deliveryLinks={[]} distanceKm={null} />);
  await fireEvent.press(screen.getByText('Delivery'));
  await fireEvent.press(screen.getByText('Takeaway'));

  expect(openSpy).not.toHaveBeenCalled();
});

test('Delivery and Takeaway both open the only delivery link directly when nearby', async () => {
  const openSpy = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
  const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

  await render(<ActionGrid menu={[]} deliveryLinks={[IFOOD]} distanceKm={NEAR_KM} />);
  await fireEvent.press(screen.getByText('Delivery'));
  await fireEvent.press(screen.getByText('Takeaway'));

  await waitFor(() => expect(openSpy).toHaveBeenCalledTimes(2));
  expect(openSpy).toHaveBeenNthCalledWith(1, IFOOD.url);
  expect(openSpy).toHaveBeenNthCalledWith(2, IFOOD.url);
  expect(alertSpy).not.toHaveBeenCalled();
  expect(screen.queryByText('Order from')).toBeNull();
});

test('Delivery with several links opens a platform chooser that opens the selected link', async () => {
  const openSpy = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);

  await render(<ActionGrid menu={[]} deliveryLinks={[IFOOD, RAPPI]} distanceKm={NEAR_KM} />);
  await fireEvent.press(screen.getByText('Delivery'));

  expect(openSpy).not.toHaveBeenCalled();
  expect(screen.getByText('iFood')).toBeTruthy();

  await fireEvent.press(screen.getByText('Rappi'));

  expect(openSpy).toHaveBeenCalledWith(RAPPI.url);
  expect(screen.queryByText('Order from')).toBeNull();
});

test('Delivery far from a trusted location asks for confirmation and opens on "Open anyway"', async () => {
  const openSpy = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
  const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

  await render(<ActionGrid menu={[]} deliveryLinks={[IFOOD]} distanceKm={FAR_KM} />);
  const press = fireEvent.press(screen.getByText('Delivery'));

  await waitFor(() => expect(alertSpy).toHaveBeenCalledTimes(1));
  expect(alertSpy.mock.calls[0][0]).toBe('Far from you');
  expect(alertSpy.mock.calls[0][1]).toContain('32.4 km');
  expect(openSpy).not.toHaveBeenCalled();

  await pressAlertButton(alertSpy, 'Open anyway');
  await press;

  await waitFor(() => expect(openSpy).toHaveBeenCalledWith(IFOOD.url));
});

test('Takeaway far from a trusted location opens nothing on "Cancel"', async () => {
  const openSpy = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
  const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

  await render(<ActionGrid menu={[]} deliveryLinks={[IFOOD, RAPPI]} distanceKm={FAR_KM} />);
  const press = fireEvent.press(screen.getByText('Takeaway'));
  await waitFor(() => expect(alertSpy).toHaveBeenCalledTimes(1));
  await pressAlertButton(alertSpy, 'Cancel');
  await press;

  expect(openSpy).not.toHaveBeenCalled();
  expect(screen.queryByText('Order from')).toBeNull();
});

test('Delivery without a trusted distance opens without confirmation', async () => {
  const openSpy = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
  const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

  await render(<ActionGrid menu={[]} deliveryLinks={[IFOOD]} distanceKm={null} />);
  await fireEvent.press(screen.getByText('Delivery'));

  await waitFor(() => expect(openSpy).toHaveBeenCalledWith(IFOOD.url));
  expect(alertSpy).not.toHaveBeenCalled();
});
