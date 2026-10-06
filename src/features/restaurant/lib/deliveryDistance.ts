import { Alert, Platform } from 'react-native';

import { formatDistanceKm } from '@/lib/geo';

export const FAR_DELIVERY_THRESHOLD_KM = 15;

const TITLE = 'Far from you';

export function confirmFarDelivery(distanceKm: number | null): Promise<boolean> {
  if (distanceKm === null || distanceKm <= FAR_DELIVERY_THRESHOLD_KM) {
    return Promise.resolve(true);
  }

  const message = `This restaurant is ${formatDistanceKm(distanceKm)} from you. The delivery app may not show it outside its delivery area.`;

  // react-native-web's Alert.alert is a no-op, which would leave the promise pending forever.
  if (Platform.OS === 'web') {
    return Promise.resolve(globalThis.confirm(`${TITLE}\n\n${message}`));
  }

  return new Promise((resolve) => {
    Alert.alert(
      TITLE,
      message,
      [
        { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
        { text: 'Open anyway', onPress: () => resolve(true) },
      ],
      { cancelable: true, onDismiss: () => resolve(false) },
    );
  });
}
