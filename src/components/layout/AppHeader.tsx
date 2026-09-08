import { useRouter } from 'expo-router';
import { Pressable, Text, TextInput, View } from 'react-native';

import { Icon } from '@/components/ui';
import { colors, iconSize } from '@/theme';

import { LocationHeader } from './LocationHeader';
import { SideMenu } from './SideMenu';

type AppHeaderSearch =
  | { mode: 'link'; onPress: () => void; placeholder?: string }
  | { mode: 'input'; value: string; onChangeText: (text: string) => void; placeholder?: string };

type AppHeaderProps = {
  search: AppHeaderSearch;
  showBack?: boolean;
  showLocation?: boolean;
};

export function AppHeader({ search, showBack = false, showLocation = false }: AppHeaderProps) {
  const router = useRouter();
  const placeholder = search.placeholder ?? 'Search restaurants...';

  return (
    <View className="bg-white">
      <View className="flex-row items-center gap-sm2 px-md pt-md">
        {showBack ? (
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
            className="h-10 w-10 items-center justify-center rounded-full bg-sand"
          >
            <Icon spec={{ set: 'Ionicons', name: 'chevron-back' }} size={iconSize.ui} color={colors.ink} />
          </Pressable>
        ) : null}

        {search.mode === 'link' ? (
          <Pressable
            onPress={search.onPress}
            className="flex-1 flex-row items-center gap-sm rounded-full bg-sand px-md py-sm2"
          >
            <Icon spec={{ set: 'Ionicons', name: 'search-outline' }} size={iconSize.inline} color={colors.inkFaint} />
            <Text className="text-sm text-muted">{placeholder}</Text>
          </Pressable>
        ) : (
          <View className="flex-1 flex-row items-center gap-sm rounded-full bg-sand px-md py-sm2">
            <Icon spec={{ set: 'Ionicons', name: 'search-outline' }} size={iconSize.inline} color={colors.inkFaint} />
            <TextInput
              value={search.value}
              onChangeText={search.onChangeText}
              placeholder={placeholder}
              placeholderTextColor={colors.inkFaint}
              className="flex-1 text-sm text-ink"
            />
          </View>
        )}

        <SideMenu />
      </View>

      {showLocation ? <LocationHeader /> : null}
    </View>
  );
}
