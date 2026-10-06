import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { BottomSheet, Icon, type IconSpec } from '@/components/ui';
import { useLinkChooser } from '@/features/restaurant/hooks/useLinkChooser';
import { confirmFarDelivery } from '@/features/restaurant/lib/deliveryDistance';
import type { LinkOption } from '@/features/restaurant/lib/externalLinks';
import { DELIVERY_PLATFORM_LABELS } from '@/features/restaurant/lib/labels';
import type { DeliveryLink, MenuItem } from '@/features/restaurant/types';
import { colors, iconSize } from '@/theme';

import { LinkChooserSheet } from './LinkChooserSheet';
import { MenuSheetContent } from './MenuSheetContent';

type ActionKey = 'menu' | 'takeaway' | 'delivery' | 'reserve';

const DELIVERY_ICON: IconSpec = { set: 'MaterialCommunityIcons', name: 'moped-outline' };

const ACTIONS: { key: ActionKey; icon: IconSpec; label: string }[] = [
  { key: 'menu', icon: { set: 'Ionicons', name: 'restaurant-outline' }, label: 'Menu' },
  { key: 'takeaway', icon: { set: 'MaterialCommunityIcons', name: 'food-takeout-box' }, label: 'Takeaway' },
  { key: 'delivery', icon: DELIVERY_ICON, label: 'Delivery' },
  { key: 'reserve', icon: { set: 'Ionicons', name: 'calendar-outline' }, label: 'Reserve' },
];

type ActionGridProps = {
  menu: MenuItem[];
  deliveryLinks: DeliveryLink[];
  distanceKm: number | null;
};

export function ActionGrid({ menu, deliveryLinks, distanceKm }: ActionGridProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const deliveryChooser = useLinkChooser();

  const deliveryOptions: LinkOption[] = deliveryLinks.map((link) => ({
    icon: DELIVERY_ICON,
    label: DELIVERY_PLATFORM_LABELS[link.platform],
    url: link.url,
  }));
  const loadDeliveryOptions = async () => ((await confirmFarDelivery(distanceKm)) ? deliveryOptions : []);
  const openDelivery = deliveryOptions.length > 0 ? () => deliveryChooser.choose(loadDeliveryOptions) : undefined;

  const handlers: Record<ActionKey, (() => void) | undefined> = {
    menu: menu.length > 0 ? () => setMenuOpen(true) : undefined,
    takeaway: openDelivery,
    delivery: openDelivery,
    reserve: undefined,
  };

  return (
    <View className="flex-row gap-sm2 px-md py-md">
      {ACTIONS.map((action) => {
        const onPress = handlers[action.key];
        const enabled = onPress !== undefined;
        return (
          <Pressable
            key={action.key}
            onPress={onPress}
            disabled={!enabled}
            className={`flex-1 items-center gap-sm rounded-lg border py-sm2 ${
              enabled ? 'border-accent bg-accent' : 'border-sand bg-white opacity-60'
            }`}
          >
            <Icon spec={action.icon} size={iconSize.ui} color={enabled ? colors.white : colors.inkFaint} />
            <Text className={`text-xs font-bold ${enabled ? 'text-white' : 'text-muted'}`}>{action.label}</Text>
          </Pressable>
        );
      })}

      <BottomSheet visible={menuOpen} onClose={() => setMenuOpen(false)}>
        <MenuSheetContent menu={menu} />
      </BottomSheet>

      <LinkChooserSheet title="Order from" options={deliveryChooser.options} onClose={deliveryChooser.close} />
    </View>
  );
}
