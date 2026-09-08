import { useState } from 'react';
import { Image, Text, View } from 'react-native';

import { colors, iconSize } from '@/theme';

import { CarouselArrows } from './CarouselArrows';
import { CarouselDots } from './CarouselDots';
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
          <CarouselArrows onPrev={goPrev} onNext={goNext} />
          <View className="absolute bottom-md right-md flex-row items-center gap-xs rounded-full bg-black/55 px-sm2 py-sm">
            <Icon spec={{ set: 'Ionicons', name: 'images-outline' }} size={iconSize.micro} color={colors.white} />
            <Text className="text-xs font-semibold text-white">More photos</Text>
          </View>
          <CarouselDots count={photos.length} activeIndex={index} variant="light" />
        </>
      ) : null}
    </View>
  );
}
