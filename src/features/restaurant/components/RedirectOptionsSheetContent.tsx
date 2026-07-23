import { Alert, Pressable, Text, View } from 'react-native';

type RedirectOption = {
  icon: string;
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
          onPress={() => Alert.alert('Simulação', `Redirecionaria para ${option.label}`)}
          className="mb-2.5 rounded-xl bg-sand-light p-4"
        >
          <Text className="text-sm font-bold text-ink">
            {option.icon} {option.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
