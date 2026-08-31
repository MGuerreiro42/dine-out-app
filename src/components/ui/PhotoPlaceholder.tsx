import { Text, View } from 'react-native';

import { colors, iconSize as tokenIconSize } from '@/theme';

import { Icon } from './Icon';

type PhotoPlaceholderProps = {
  className?: string;
  iconSize?: number;
  label?: string;
};

export function PhotoPlaceholder({ className = 'h-full w-full', iconSize = tokenIconSize.ui, label }: PhotoPlaceholderProps) {
  return (
    <View className={`items-center justify-center gap-xs bg-sand-light ${className}`}>
      <Icon spec={{ set: 'Ionicons', name: 'image-outline' }} size={iconSize} color={colors.inkFaint} />
      {label ? <Text className="px-sm text-center text-xs text-muted">{label}</Text> : null}
    </View>
  );
}
