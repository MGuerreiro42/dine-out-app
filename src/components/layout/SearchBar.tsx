import { Text, View } from 'react-native';

import { Icon } from '@/components/ui';

export function SearchBar() {
  return (
    <View className="flex-1 flex-row items-center gap-2 rounded-full bg-sand px-4 py-3">
      <Icon spec={{ set: 'Ionicons', name: 'search-outline' }} size={16} color="#8a8580" />
      <Text className="text-sm text-muted">Search restaurants...</Text>
    </View>
  );
}
