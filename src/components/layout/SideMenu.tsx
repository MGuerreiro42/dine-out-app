import { type Href, useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

import { Icon, type IconSpec } from '@/components/ui';
import { CURRENT_USER } from '@/mocks/currentUser';
import { useAuthStore } from '@/stores/auth';

const NAV_ITEMS: { label: string; icon: IconSpec; route: string }[] = [
  { label: 'Home', icon: { set: 'Ionicons', name: 'home-outline' }, route: '/' },
  { label: 'Buscar', icon: { set: 'Ionicons', name: 'search-outline' }, route: '/search' },
  { label: 'Categorias', icon: { set: 'Ionicons', name: 'grid-outline' }, route: '/category' },
  { label: 'Favoritos', icon: { set: 'Ionicons', name: 'heart-outline' }, route: '/profile' },
  { label: 'Meus pedidos', icon: { set: 'Ionicons', name: 'receipt-outline' }, route: '/profile/orders' },
  { label: 'Minhas reservas', icon: { set: 'Ionicons', name: 'calendar-outline' }, route: '/profile/reservations' },
  {
    label: 'Notificações',
    icon: { set: 'Ionicons', name: 'notifications-outline' },
    route: '/profile/notifications',
  },
];

export function SideMenu() {
  const router = useRouter();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const logout = useAuthStore((s) => s.logout);
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);
  const goTo = (route: string) => {
    close();
    router.push(route as Href);
  };

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        className="h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#f3f4f6]"
      >
        <Icon spec={{ set: 'Ionicons', name: 'person-outline' }} size={18} color="#1f2937" />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={close}>
        <Pressable onPress={close} className="flex-1 flex-row bg-black/35">
          <Pressable onPress={(e) => e.stopPropagation()} className="h-full w-[82%] bg-white p-5">
            <View className="mb-4 flex-row items-center justify-between">
              <Pressable
                onPress={close}
                className="h-8 w-8 items-center justify-center rounded-full bg-sand"
              >
                <Icon spec={{ set: 'Ionicons', name: 'chevron-back' }} size={16} />
              </Pressable>
              <Pressable
                onPress={close}
                className="h-8 w-8 items-center justify-center rounded-full bg-sand"
              >
                <Icon spec={{ set: 'Ionicons', name: 'close' }} size={16} />
              </Pressable>
            </View>

            {isLoggedIn ? (
              <Pressable onPress={() => goTo('/profile')} className="mb-6 flex-row items-center gap-3">
                <View className="h-12 w-12 items-center justify-center rounded-full bg-gold">
                  <Text className="text-base font-bold text-ink">{CURRENT_USER.initial}</Text>
                </View>
                <View>
                  <Text className="text-sm font-bold text-ink">{CURRENT_USER.name}</Text>
                  <Text className="text-[11px] text-muted">Ver perfil</Text>
                </View>
              </Pressable>
            ) : (
              <Pressable
                onPress={() => goTo('/login')}
                className="mb-6 items-center rounded-xl bg-ink py-3.5"
              >
                <Text className="text-[13px] font-bold text-white">Entrar ou criar conta</Text>
              </Pressable>
            )}

            <View className="gap-0.5">
              {NAV_ITEMS.map((item) => (
                <Pressable
                  key={item.label}
                  onPress={() => goTo(item.route)}
                  className="flex-row items-center gap-3.5 border-b border-sand py-3.5"
                >
                  <Icon spec={item.icon} size={18} />
                  <Text className="text-sm font-bold text-ink">{item.label}</Text>
                </Pressable>
              ))}
            </View>

            {isLoggedIn ? (
              <Pressable onPress={logout} className="mt-auto py-3.5">
                <Text className="text-sm font-bold text-[#b23b3b]">Sair da conta</Text>
              </Pressable>
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
