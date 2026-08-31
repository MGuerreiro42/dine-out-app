import { Alert, Pressable, Text, View } from 'react-native';

export function ReserveSheetContent() {
  return (
    <View>
      <Text className="mb-md text-lg font-bold text-ink">Reserve a table</Text>
      <Text className="mb-md text-sm text-muted">
        Confirm your reservation. You'll be redirected to the restaurant's booking system.
      </Text>
      <Pressable
        onPress={() => Alert.alert('Demo', 'Reservation confirmed')}
        className="rounded-lg bg-ink p-md"
      >
        <Text className="text-center text-sm font-bold text-white">Confirm reservation</Text>
      </Pressable>
    </View>
  );
}
