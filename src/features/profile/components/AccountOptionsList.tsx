import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/ui';
import type { AccountOption } from '@/features/profile/types';

type AccountOptionsListProps = {
  options: AccountOption[];
  onPress: (id: string) => void;
};

export function AccountOptionsList({ options, onPress }: AccountOptionsListProps) {
  return (
    <View className="px-4 pt-2">
      <Text className="pb-1 text-base font-bold text-ink">Conta</Text>
      {options.map((option) => (
        <Pressable
          key={option.id}
          onPress={() => onPress(option.id)}
          className="flex-row items-center justify-between border-b border-sand py-3.5"
        >
          <Text className={`text-sm font-bold ${option.danger ? 'text-[#b23b3b]' : 'text-ink'}`}>
            {option.label}
          </Text>
          <Icon spec={{ set: 'Ionicons', name: 'chevron-forward' }} size={16} color="#d1d5db" />
        </Pressable>
      ))}
    </View>
  );
}
