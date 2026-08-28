import { Pressable, Text, View } from 'react-native';

import { Icon, type IconSpec } from './Icon';

type EmptyStateProps = {
  icon: IconSpec;
  title: string;
  subtitle: string;
  cta?: { label: string; onPress: () => void };
};

export function EmptyState({ icon, title, subtitle, cta }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center gap-2 px-8">
      <Icon spec={icon} size={32} color="#8a8580" />
      <Text className="text-center text-sm font-bold text-ink">{title}</Text>
      <Text className="text-center text-xs text-muted">{subtitle}</Text>
      {cta ? (
        <Pressable
          onPress={cta.onPress}
          className="mt-3 w-full flex-row items-center justify-between border-t border-sand py-3.5"
        >
          <Text className="text-sm font-bold text-ink">{cta.label}</Text>
          <Icon spec={{ set: 'Ionicons', name: 'chevron-forward' }} size={16} color="#d1d5db" />
        </Pressable>
      ) : null}
    </View>
  );
}
