import { Alert, Pressable, Text, View } from 'react-native';

export function ReserveSheetContent() {
  return (
    <View>
      <Text className="mb-3.5 text-lg font-bold text-ink">Reserve a table</Text>
      <Text className="mb-4 text-sm text-muted">
        Confirme sua reserva. Você será redirecionado ao sistema de reservas do restaurante.
      </Text>
      <Pressable
        onPress={() => Alert.alert('Simulação', 'Reserva confirmada')}
        className="rounded-xl bg-ink p-3.5"
      >
        <Text className="text-center text-sm font-bold text-white">Confirmar reserva</Text>
      </Pressable>
    </View>
  );
}
