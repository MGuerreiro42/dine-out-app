import { Pressable, Text } from 'react-native';

type MenuOptionProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

export function MenuOption({ label, active, onPress }: MenuOptionProps) {
  return (
    <Pressable onPress={onPress} className="px-md py-sm2">
      <Text className={`text-sm ${active ? 'font-bold text-accent' : 'text-ink'}`}>{label}</Text>
    </Pressable>
  );
}
