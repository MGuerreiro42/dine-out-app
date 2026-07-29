import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { BottomSheet, Icon } from '@/components/ui';
import type { OpeningHours } from '@/features/restaurant/types';

import { OpeningHoursSheetContent } from './OpeningHoursSheetContent';
import { RedirectOptionsSheetContent } from './RedirectOptionsSheetContent';

type InfoAction = 'contact' | 'hours';

type InfoActionsRowProps = {
  phone: string;
  whatsapp: string;
  instagramHandle: string;
  openingHours: OpeningHours[];
};

export function InfoActionsRow({ phone, whatsapp, instagramHandle, openingHours }: InfoActionsRowProps) {
  const [openAction, setOpenAction] = useState<InfoAction | null>(null);

  return (
    <View className="flex-row gap-2.5 px-4 pb-4">
      <Pressable
        onPress={() => setOpenAction('contact')}
        className="flex-1 flex-row items-center justify-center gap-1.5 rounded-2xl bg-ink p-3.5"
      >
        <Icon spec={{ set: 'Ionicons', name: 'call-outline' }} size={16} color="#fff" />
        <Text className="text-[13px] font-bold text-white">Contact & socials</Text>
      </Pressable>
      <Pressable
        onPress={() => setOpenAction('hours')}
        className="flex-1 flex-row items-center justify-center gap-1.5 rounded-2xl bg-sand p-3.5"
      >
        <Icon spec={{ set: 'Ionicons', name: 'time-outline' }} size={16} />
        <Text className="text-[13px] font-bold text-ink">Opening Hours</Text>
      </Pressable>

      <BottomSheet visible={openAction !== null} onClose={() => setOpenAction(null)}>
        {openAction === 'contact' ? (
          <RedirectOptionsSheetContent
            title="Contact & socials"
            options={[
              { icon: { set: 'Ionicons', name: 'call-outline' }, label: `Ligar: ${phone}` },
              { icon: { set: 'Ionicons', name: 'logo-whatsapp' }, label: `WhatsApp: ${whatsapp}` },
              { icon: { set: 'Ionicons', name: 'logo-instagram' }, label: `Instagram: ${instagramHandle}` },
            ]}
          />
        ) : null}
        {openAction === 'hours' ? <OpeningHoursSheetContent openingHours={openingHours} /> : null}
      </BottomSheet>
    </View>
  );
}
