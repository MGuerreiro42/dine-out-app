import { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';

import { colors, iconSize } from '@/theme';

import { Icon } from './Icon';
import { PhotoPlaceholder } from './PhotoPlaceholder';

type PhotoCarouselProps = {
  photos: string[];
};

export function PhotoCarousel({ photos }: PhotoCarouselProps) {
  const [index, setIndex] = useState(0);
  const hasPhotos = photos.length > 0;
  const hasMultiple = photos.length > 1;

  const goPrev = () => setIndex((current) => (current - 1 + photos.length) % photos.length);
  const goNext = () => setIndex((current) => (current + 1) % photos.length);

  return (
    <View className="aspect-[4/3] w-full overflow-hidden bg-sand">
      {hasPhotos ? (
        <Image source={{ uri: photos[index] }} className="h-full w-full" />
      ) : (
        <PhotoPlaceholder iconSize={iconSize.empty} label="No photos available" />
      )}

      {hasMultiple ? (
        <>
          <Pressable
            onPress={goPrev}
            className="absolute left-sm2 top-1/2 h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40"
          >
            <Icon spec={{ set: 'Ionicons', name: 'chevron-back' }} size={iconSize.ui} color={colors.white} />
          </Pressable>
          <Pressable
            onPress={goNext}
            className="absolute right-sm2 top-1/2 h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40"
          >
            <Icon spec={{ set: 'Ionicons', name: 'chevron-forward' }} size={iconSize.ui} color={colors.white} />
          </Pressable>
          <View className="absolute bottom-md right-md flex-row items-center gap-xs rounded-full bg-black/55 px-sm2 py-sm">
            <Icon spec={{ set: 'Ionicons', name: 'images-outline' }} size={iconSize.micro} color={colors.white} />
            <Text className="text-xs font-semibold text-white">More photos</Text>
          </View>
          <View className="absolute bottom-md left-md flex-row items-center gap-xs">
            {photos.map((_photo, photoIndex) => (
              <View
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length row of dots mirroring the photos array's own stable order.
                key={photoIndex}
                className={`h-1.5 rounded-full ${photoIndex === index ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
              />
            ))}
          </View>
        </>
      ) : null}
    </View>
  );
}
