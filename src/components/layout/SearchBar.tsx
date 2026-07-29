import { TextInput, View } from 'react-native';

import { Icon } from '@/components/ui';

type SearchBarProps = {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  editable?: boolean;
};

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search restaurants...',
  editable = true,
}: SearchBarProps) {
  return (
    <View className="flex-1 flex-row items-center gap-2 rounded-full bg-sand px-4 py-3">
      <Icon spec={{ set: 'Ionicons', name: 'search-outline' }} size={16} color="#8a8580" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8a8580"
        editable={editable}
        className="flex-1 text-sm text-ink"
      />
    </View>
  );
}
