import { Pressable, Text, View } from 'react-native';

import { openExternalUrl, toInstagramUrl } from '@/features/restaurant/lib/externalLinks';

type InstagramSectionProps = {
  handle: string | null;
};

export function InstagramSection({ handle }: InstagramSectionProps) {
  if (!handle) {
    return null;
  }

  return (
    <View className="border-t border-sand-border px-md py-md2">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-sm">
          <View className="h-8 w-8 rounded-full bg-[#c1348a]" />
          <Text className="text-sm font-bold text-ink">{handle}</Text>
        </View>
        <Pressable onPress={() => openExternalUrl(toInstagramUrl(handle))} className="rounded-full bg-accent px-md py-sm">
          <Text className="text-xs font-light text-white">OPEN ON INSTAGRAM</Text>
        </Pressable>
      </View>
    </View>
  );
}
