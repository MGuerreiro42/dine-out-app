import { Text, View } from "react-native";

type ProfileStatsProps = {
  favCount: number;
};

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <View className="items-center">
      <Text className="text-lg font-bold text-ink">{value}</Text>
      <Text className="text-caption text-muted">{label}</Text>
    </View>
  );
}

export function ProfileStats({ favCount }: ProfileStatsProps) {
  return (
    <View className="flex-row justify-around border-b border-sand-border px-md py-md">
      <Stat value={favCount} label="Favorites" />
    </View>
  );
}
