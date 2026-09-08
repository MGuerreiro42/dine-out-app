import { Pressable, Text, View } from 'react-native';

import { colors, iconSize } from '@/theme';

import { Icon, type IconSpec } from './Icon';

type EmptyStateProps = {
  icon: IconSpec;
  title: string;
  subtitle: string;
  cta?: { label: string; onPress: () => void };
};

export function EmptyState({ icon, title, subtitle, cta }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center gap-sm px-xl">
      <Icon spec={icon} size={iconSize.empty} color={colors.inkFaint} />
      <Text className="text-center text-sm font-bold text-ink">{title}</Text>
      <Text className="text-center text-xs text-muted">{subtitle}</Text>
      {cta ? (
        <Pressable
          onPress={cta.onPress}
          className="mt-sm2 w-full flex-row items-center justify-between border-t border-sand py-md"
        >
          <Text className="text-sm font-bold text-ink">{cta.label}</Text>
          <Icon spec={{ set: 'Ionicons', name: 'chevron-forward' }} size={iconSize.inline} color={colors.inkSubtle} />
        </Pressable>
      ) : null}
    </View>
  );
}
