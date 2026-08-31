import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { BottomSheet, Icon, type IconSpec } from '@/components/ui';
import { getSocialLinkIcon, getSocialLinkLabel, getWebsiteLabel } from '@/features/restaurant/lib/labels';
import { colors, iconSize } from '@/theme';

import { RedirectOptionsSheetContent } from './RedirectOptionsSheetContent';

type InfoActionsRowProps = {
  phones: string[];
  whatsapp: string | null;
  instagramHandle: string | null;
  websites: string[];
  socialLinks: string[];
};

export function InfoActionsRow({ phones, whatsapp, instagramHandle, websites, socialLinks }: InfoActionsRowProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const contactOptions: { icon: IconSpec; label: string }[] = [
    ...phones.map((phone) => ({ icon: { set: 'Ionicons', name: 'call-outline' } as IconSpec, label: `Call: ${phone}` })),
    whatsapp ? { icon: { set: 'Ionicons', name: 'logo-whatsapp' } as IconSpec, label: `WhatsApp: ${whatsapp}` } : null,
    instagramHandle
      ? { icon: { set: 'Ionicons', name: 'logo-instagram' } as IconSpec, label: `Instagram: ${instagramHandle}` }
      : null,
    ...websites.map((website) => ({
      icon: { set: 'Ionicons', name: 'globe-outline' } as IconSpec,
      label: `Website: ${getWebsiteLabel(website)}`,
    })),
    ...socialLinks.map((link) => ({ icon: getSocialLinkIcon(link), label: getSocialLinkLabel(link) })),
  ].filter((option): option is { icon: IconSpec; label: string } => option !== null);

  if (contactOptions.length === 0) {
    return null;
  }

  return (
    <View className="px-md pb-md">
      <Pressable
        onPress={() => setSheetOpen(true)}
        className="flex-row items-center justify-center gap-sm rounded-lg bg-sand-light p-md"
      >
        <Icon spec={{ set: 'Ionicons', name: 'call-outline' }} size={iconSize.inline} color={colors.ink} />
        <Text className="text-body font-bold text-ink">Contact & socials</Text>
      </Pressable>

      <BottomSheet visible={sheetOpen} onClose={() => setSheetOpen(false)}>
        <RedirectOptionsSheetContent title="Contact & socials" options={contactOptions} />
      </BottomSheet>
    </View>
  );
}
