import * as Location from 'expo-location';
import { useState } from 'react';
import { Platform, TextInput, View } from 'react-native';

import { Icon } from '@/components/ui';
import { useLocationStore } from '@/stores/location';
import { colors, iconSize } from '@/theme';

export function AddressSearchInput() {
  const [query, setQuery] = useState('');
  const setManualLocation = useLocationStore((s) => s.setManualLocation);

  if (Platform.OS === 'web') {
    return null;
  }

  const handleSubmit = async () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    try {
      const [first] = await Location.geocodeAsync(trimmed);
      if (first) {
        await setManualLocation({ latitude: first.latitude, longitude: first.longitude });
        setQuery('');
      }
    } catch {}
  };

  return (
    <View className="flex-row items-center gap-sm rounded-full bg-sand px-md py-sm2">
      <Icon spec={{ set: 'Ionicons', name: 'search-outline' }} size={iconSize.inline} color={colors.inkFaint} />
      <TextInput
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
        placeholder="Search address..."
        placeholderTextColor={colors.inkFaint}
        className="flex-1 text-sm text-ink"
      />
    </View>
  );
}
