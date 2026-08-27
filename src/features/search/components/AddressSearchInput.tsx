import * as Location from 'expo-location';
import { useState } from 'react';
import { Platform, TextInput, View } from 'react-native';

import { Icon } from '@/components/ui';
import { useLocationStore } from '@/stores/location';

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
    <View className="flex-row items-center gap-2 rounded-full bg-sand px-4 py-3">
      <Icon spec={{ set: 'Ionicons', name: 'search-outline' }} size={16} color="#8a8580" />
      <TextInput
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
        placeholder="Search address..."
        placeholderTextColor="#8a8580"
        className="flex-1 text-sm text-ink"
      />
    </View>
  );
}
