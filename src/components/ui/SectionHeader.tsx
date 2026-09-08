import { Pressable, Text, View } from 'react-native';

import { colors, iconSize } from '@/theme';

import { Icon, type IconSpec } from './Icon';

type SectionHeaderProps = {
  icon?: IconSpec;
  title: string;
  viewAll?: { label?: string; onPress: () => void };
};

export function SectionHeader({ icon, title, viewAll }: SectionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-md pb-sm pt-lg">
      <View className="flex-row items-center gap-sm">
        {icon ? <Icon spec={icon} size={iconSize.inline} color={colors.accent} /> : null}
        <Text className="text-lg font-bold text-ink">{title}</Text>
      </View>
      {viewAll ? (
        <Pressable onPress={viewAll.onPress}>
          <Text className="text-xs font-normal text-accent">{viewAll.label ?? 'View all'}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
