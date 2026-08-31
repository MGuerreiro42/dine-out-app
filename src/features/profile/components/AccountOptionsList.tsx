import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/ui';
import { colors, iconSize } from '@/theme';
import type { AccountOption } from '@/features/profile/types';

type AccountOptionsListProps = {
  options: AccountOption[];
  onPress: (id: string) => void;
};

export function AccountOptionsList({ options, onPress }: AccountOptionsListProps) {
  return (
    <View className="px-md pt-sm">
      <Text className="pb-xs text-base font-bold text-ink">Conta</Text>
      {options.map((option) => (
        <Pressable
          key={option.id}
          onPress={() => onPress(option.id)}
          className="flex-row items-center justify-between border-b border-sand py-md"
        >
          <Text className={`text-sm font-bold ${option.danger ? 'text-danger' : 'text-ink'}`}>
            {option.label}
          </Text>
          <Icon spec={{ set: 'Ionicons', name: 'chevron-forward' }} size={iconSize.inline} color={colors.inkSubtle} />
        </Pressable>
      ))}
    </View>
  );
}
