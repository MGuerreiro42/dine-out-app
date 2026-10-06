import { Text, View } from 'react-native';

import { colors, iconSize } from '@/theme';

import { Icon } from './Icon';

type DistanceChipProps = {
  label: string | null;
  variant?: 'dark' | 'light';
};

const VARIANTS = {
  dark: {
    container: 'absolute left-sm top-sm flex-row items-center gap-xs rounded-lg bg-black/70 px-sm py-xs',
    text: 'text-caption font-bold text-white',
    color: colors.white,
  },
  light: {
    container: 'absolute left-sm2 top-sm2 flex-row items-center gap-xs rounded-full bg-white/95 px-sm2 py-xs',
    text: 'text-caption font-bold text-ink',
    color: colors.ink,
  },
};

export function DistanceChip({ label, variant = 'dark' }: DistanceChipProps) {
  if (label === null) {
    return null;
  }

  const style = VARIANTS[variant];

  return (
    <View className={style.container}>
      <Icon spec={{ set: 'Ionicons', name: 'location-outline' }} size={iconSize.micro} color={style.color} />
      <Text className={style.text}>{label}</Text>
    </View>
  );
}
