import { Text, View } from 'react-native';

type ProfileStatsProps = {
  favCount: number;
  orderCount: number;
  reservationCount: number;
};

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <View className="items-center">
      <Text className="text-lg font-bold text-ink">{value}</Text>
      <Text className="text-[13px] text-muted">{label}</Text>
    </View>
  );
}

export function ProfileStats({ favCount, orderCount, reservationCount }: ProfileStatsProps) {
  return (
    <View className="flex-row justify-around border-b border-gray-100 px-4 py-4">
      <Stat value={favCount} label="Favoritos" />
      <Stat value={orderCount} label="Pedidos" />
      <Stat value={reservationCount} label="Reservas" />
    </View>
  );
}
