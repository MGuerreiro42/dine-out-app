import { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';

type PhotoCarouselProps = {
  photos: string[];
};

export function PhotoCarousel({ photos }: PhotoCarouselProps) {
  const [index, setIndex] = useState(0);
  const hasMultiple = photos.length > 1;

  const goPrev = () => setIndex((current) => (current - 1 + photos.length) % photos.length);
  const goNext = () => setIndex((current) => (current + 1) % photos.length);

  return (
    <View className="aspect-[4/3] w-full overflow-hidden bg-gray-200">
      <Image source={{ uri: photos[index] }} className="h-full w-full" />
      <View className="absolute inset-0 bg-black/10" />

      {hasMultiple ? (
        <>
          <Pressable
            onPress={goPrev}
            className="absolute left-2.5 top-1/2 h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40"
          >
            <Text className="text-lg leading-none text-white">‹</Text>
          </Pressable>
          <Pressable
            onPress={goNext}
            className="absolute right-2.5 top-1/2 h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40"
          >
            <Text className="text-lg leading-none text-white">›</Text>
          </Pressable>
          <View className="absolute bottom-3 right-3.5 rounded-full bg-black/55 px-2.5 py-1">
            <Text className="text-xs text-white">
              {index + 1}/{photos.length}
            </Text>
          </View>
        </>
      ) : null}
    </View>
  );
}
