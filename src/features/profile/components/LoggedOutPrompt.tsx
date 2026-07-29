import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/ui';

type LoggedOutPromptProps = {
  onLogin: () => void;
  onExploreRestaurants: () => void;
  onSearchOnMap: () => void;
  onNotificationPreferences: () => void;
};

export function LoggedOutPrompt({
  onLogin,
  onExploreRestaurants,
  onSearchOnMap,
  onNotificationPreferences,
}: LoggedOutPromptProps) {
  return (
    <View>
      <View className="px-4 py-5">
        <Pressable onPress={onLogin} className="items-center rounded-xl bg-ink py-3.5">
          <Text className="text-sm font-bold text-white">Entrar ou criar conta</Text>
        </Pressable>
        <Text className="mt-3.5 text-center text-xs text-muted">
          Crie uma conta para favoritar restaurantes, acompanhar pedidos e fazer reservas com um toque.
        </Text>
      </View>

      <View className="border-t border-gray-100 px-4 pb-5 pt-1.5">
        <Text className="py-3 text-base font-bold text-ink">Descubra sem sair da conta</Text>
        <Pressable
          onPress={onExploreRestaurants}
          className="flex-row items-center justify-between border-b border-sand py-3.5"
        >
          <Text className="text-sm font-bold text-ink">Explorar restaurantes</Text>
          <Icon spec={{ set: 'Ionicons', name: 'chevron-forward' }} size={16} color="#d1d5db" />
        </Pressable>
        <Pressable
          onPress={onSearchOnMap}
          className="flex-row items-center justify-between border-b border-sand py-3.5"
        >
          <Text className="text-sm font-bold text-ink">Buscar no mapa</Text>
          <Icon spec={{ set: 'Ionicons', name: 'chevron-forward' }} size={16} color="#d1d5db" />
        </Pressable>
        <Pressable onPress={onNotificationPreferences} className="py-3.5">
          <Text className="text-sm font-bold text-ink">Preferências de notificação</Text>
        </Pressable>
      </View>
    </View>
  );
}
