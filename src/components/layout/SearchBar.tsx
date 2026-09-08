import { TextInput, View } from 'react-native';

import { Icon } from '@/components/ui';
import { colors, iconSize } from '@/theme';

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
    <View className="flex-1 flex-row items-center gap-sm rounded-full bg-sand px-md py-sm2">
      <Icon spec={{ set: 'Ionicons', name: 'search-outline' }} size={iconSize.inline} color={colors.inkFaint} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.inkFaint}
        editable={editable}
        className="flex-1 text-sm text-ink"
      />
    </View>
  );
}
