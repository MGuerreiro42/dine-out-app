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
      <Text className="mb-3.5 text-lg font-bold text-ink">{title}</Text>
      {options.map((option) => (
        <Pressable
          key={option.label}
          onPress={() => Alert.alert('Demo', `Would redirect to ${option.label}`)}
          className="mb-2.5 flex-row items-center gap-2.5 rounded-xl bg-sand-light p-4"
        >
          <Icon spec={option.icon} size={18} />
          <Text className="text-sm font-bold text-ink">{option.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}
