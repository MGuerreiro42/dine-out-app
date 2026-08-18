import { Alert, Image, Pressable, Text, View } from 'react-native';

type InstagramSectionProps = {
  handle: string;
  photos: string[];
};

export function InstagramSection({ handle, photos }: InstagramSectionProps) {
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
          onPress={() => Alert.alert('Demo', "Would open the restaurant's Instagram.")}
          className="rounded-full bg-accent px-4 py-2"
        >
          <Text className="text-xs font-light text-white">OPEN ON INSTAGRAM</Text>
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
