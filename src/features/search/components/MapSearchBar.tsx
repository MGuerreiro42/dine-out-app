import { TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui';
import { colors, iconSize, spacing } from '@/theme';

type MapSearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
};

export function MapSearchBar({ value, onChangeText }: MapSearchBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ position: 'absolute', top: insets.top + spacing.md, left: spacing.md, right: spacing.md }}>
      <View className="flex-row items-center gap-sm rounded-full bg-white px-md py-sm2 shadow-lg">
        <Icon spec={{ set: 'Ionicons', name: 'search-outline' }} size={iconSize.inline} color={colors.inkFaint} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Search restaurants..."
          placeholderTextColor={colors.inkFaint}
          className="flex-1 text-sm text-ink"
        />
      </View>
    </View>
  );
}
