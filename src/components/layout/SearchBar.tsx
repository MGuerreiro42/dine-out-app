import { Text, View } from 'react-native';

export function SearchBar() {
  return (
    <View className="flex-1 flex-row items-center gap-2 rounded-full bg-sand px-4 py-3">
      <Text className="text-sm text-muted">🔍</Text>
      <Text className="text-sm text-muted">Search restaurants...</Text>
    </View>
  );
}
