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
      className={`rounded-full px-md py-sm ${active ? 'bg-ink' : 'bg-sand'}`}
    >
      <Text className={`text-sm font-light ${active ? 'text-white' : 'text-ink'}`}>{label}</Text>
    </Pressable>
  );
}
