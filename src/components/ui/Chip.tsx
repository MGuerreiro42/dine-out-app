import { Pressable, Text } from 'react-native';

type ChipProps = {
  label: string;
  active?: boolean;
  onPress: () => void;
};

export function Chip({ label, active = false, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-full px-4 py-2 ${active ? 'bg-ink' : 'bg-sand'}`}
    >
      <Text className={`text-sm font-bold ${active ? 'text-white' : 'text-ink'}`}>{label}</Text>
    </Pressable>
  );
}
