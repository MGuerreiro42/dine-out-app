import { Alert, Pressable, Text, View } from 'react-native';

import { Icon, type IconSpec } from '@/components/ui';

type RedirectOption = {
  icon: IconSpec;
  label: string;
};

type RedirectOptionsSheetContentProps = {
  title: string;
  options: RedirectOption[];
};

export function RedirectOptionsSheetContent({ title, options }: RedirectOptionsSheetContentProps) {
  return (
    <View>
      <Text className="mb-md text-lg font-bold text-ink">{title}</Text>
      {options.map((option) => (
        <Pressable
          key={option.label}
          onPress={() => Alert.alert('Demo', `Would redirect to ${option.label}`)}
          className="mb-sm2 flex-row items-center gap-sm2 rounded-lg bg-sand-light p-md"
        >
          <Icon spec={option.icon} />
          <Text className="text-sm font-bold text-ink">{option.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}
