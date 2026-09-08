import { Pressable } from 'react-native';

import { colors, iconSize } from '@/theme';

import { Icon } from './Icon';

type CarouselArrowsProps = {
  onPrev: () => void;
  onNext: () => void;
};

export function CarouselArrows({ onPrev, onNext }: CarouselArrowsProps) {
  return (
    <>
      <Pressable
        onPress={onPrev}
        className="absolute left-sm2 top-1/2 h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40"
      >
        <Icon spec={{ set: 'Ionicons', name: 'chevron-back' }} size={iconSize.ui} color={colors.white} />
      </Pressable>
      <Pressable
        onPress={onNext}
        className="absolute right-sm2 top-1/2 h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40"
      >
        <Icon spec={{ set: 'Ionicons', name: 'chevron-forward' }} size={iconSize.ui} color={colors.white} />
      </Pressable>
    </>
  );
}
