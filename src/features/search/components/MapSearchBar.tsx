import { TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui';

type MapSearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
};

// Floating search pill docked over the map — absolute positioned with a
// safe-area offset since this screen goes edge-to-edge (the shared layout
// SearchBar assumes a normal inline flex row, so it isn't reused directly
// here). The design's leftover back arrow next to this bar was dropped,
// same correction already applied to the Category page's back arrow — this
// screen is a tab root, not a stack-pushed screen.
export function MapSearchBar({ value, onChangeText }: MapSearchBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ position: 'absolute', top: insets.top + 14, left: 14, right: 14 }}>
      <View className="flex-row items-center gap-2 rounded-full bg-white px-4 py-3 shadow-lg">
        <Icon spec={{ set: 'Ionicons', name: 'search-outline' }} size={16} color="#8a8580" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Search restaurants..."
          placeholderTextColor="#8a8580"
          className="flex-1 text-sm text-ink"
        />
      </View>
    </View>
  );
}
