import { Text, View } from 'react-native';

import { Icon } from './Icon';

type PhotoPlaceholderProps = {
  className?: string;
  iconSize?: number;
  label?: string;
};

export function PhotoPlaceholder({ className = 'h-full w-full', iconSize = 20, label }: PhotoPlaceholderProps) {
  return (
    <View className={`items-center justify-center gap-1 bg-sand-light ${className}`}>
      <Icon spec={{ set: 'Ionicons', name: 'image-outline' }} size={iconSize} color="#8a8580" />
      {label ? <Text className="px-2 text-center text-xs text-muted">{label}</Text> : null}
    </View>
  );
}
