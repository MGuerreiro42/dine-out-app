import { Alert, Pressable, Text, View } from 'react-native';

export function ReserveSheetContent() {
  return (
    <View>
      <Text className="mb-3.5 text-lg font-bold text-ink">Reserve a table</Text>
      <Text className="mb-4 text-sm text-muted">
        Confirm your reservation. You'll be redirected to the restaurant's booking system.
      </Text>
      <Pressable
        onPress={() => Alert.alert('Demo', 'Reservation confirmed')}
        className="rounded-xl bg-ink p-3.5"
      >
        <Text className="text-center text-sm font-bold text-white">Confirm reservation</Text>
      </Pressable>
    </View>
  );
}
