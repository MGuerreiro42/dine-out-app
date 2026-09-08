import { View } from 'react-native';

type CarouselDotsVariant = 'accent' | 'light';

type CarouselDotsProps = {
  count: number;
  activeIndex: number;
  variant?: CarouselDotsVariant;
};

const CONTAINER_CLASS: Record<CarouselDotsVariant, string> = {
  accent: 'mt-sm2 flex-row items-center justify-center gap-sm',
  light: 'absolute bottom-md left-md flex-row items-center gap-xs',
};

const DOT_COLOR_CLASS: Record<CarouselDotsVariant, { active: string; inactive: string }> = {
  accent: { active: 'bg-accent-pressed', inactive: 'bg-sand-border' },
  light: { active: 'bg-white', inactive: 'bg-white/50' },
};

export function CarouselDots({ count, activeIndex, variant = 'accent' }: CarouselDotsProps) {
  const colorClass = DOT_COLOR_CLASS[variant];

  return (
    <View className={CONTAINER_CLASS[variant]}>
      {Array.from({ length: count }, (_, dotIndex) => (
        <View
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length row of dots mirroring the carousel's own stable order.
          key={dotIndex}
          className={`h-1.5 rounded-full ${dotIndex === activeIndex ? `w-4 ${colorClass.active}` : `w-1.5 ${colorClass.inactive}`}`}
        />
      ))}
    </View>
  );
}
