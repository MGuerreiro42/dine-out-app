import { type Href, useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Icon } from './Icon';

type PlaceholderScreenProps = {
  title: string;
  fallbackRoute: string;
};

export function PlaceholderScreen({ title, fallbackRoute }: PlaceholderScreenProps) {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center gap-2.5 px-4 pb-2 pt-4">
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace(fallbackRoute as Href))}
          className="h-10 w-10 items-center justify-center rounded-xl bg-sand"
        >
          <Icon spec={{ set: 'Ionicons', name: 'chevron-back' }} size={20} />
        </Pressable>
        <Text className="text-lg font-bold text-ink">{title}</Text>
      </View>
      <View className="flex-1 items-center justify-center px-8">
        <Text className="text-center text-sm text-muted">Coming soon.</Text>
      </View>
    </View>
  );
}
