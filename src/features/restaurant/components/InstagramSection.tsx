import { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';

type InstagramSectionProps = {
  handle: string;
  photos: string[];
};

export function InstagramSection({ handle, photos }: InstagramSectionProps) {
  const [following, setFollowing] = useState(false);

  return (
    <View className="border-t border-gray-100 px-4 py-5">
      <View className="mb-3 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          {/* Solid brand-ish color instead of the design's gradient circle —
              no gradient utility without adding expo-linear-gradient, and this
              is purely decorative */}
          <View className="h-8 w-8 rounded-full bg-[#c1348a]" />
          <Text className="text-sm font-bold text-ink">{handle}</Text>
        </View>
        <Pressable
          onPress={() => setFollowing((value) => !value)}
          className={`rounded-full px-4 py-2 ${following ? 'bg-sand' : 'bg-ink'}`}
        >
          <Text className={`text-xs font-bold ${following ? 'text-ink' : 'text-white'}`}>
            {following ? 'Following' : 'Follow'}
          </Text>
        </Pressable>
      </View>

      <View className="flex-row flex-wrap gap-1">
        {photos.map((photo) => (
          <Image key={photo} source={{ uri: photo }} className="aspect-square" style={{ width: '32.6%' }} />
        ))}
      </View>
    </View>
  );
}
