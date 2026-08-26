import { Alert, Pressable, Text, View } from 'react-native';

import { Icon, type IconSpec } from '@/components/ui';
import { getSocialLinkIcon, getSocialLinkLabel, getWebsiteLabel } from '@/features/restaurant/lib/labels';

type InfoActionsRowProps = {
  phones: string[];
  whatsapp: string | null;
  instagramHandle: string | null;
  websites: string[];
  socialLinks: string[];
};

export function InfoActionsRow({ phones, whatsapp, instagramHandle, websites, socialLinks }: InfoActionsRowProps) {
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
    <View className="border-t border-gray-100 px-4 py-5">
      <Text className="mb-3 text-base font-bold text-ink">Contact & socials</Text>

      <View className="gap-2.5">
        {contactOptions.map((option, index) => (
          <Pressable
            key={`${option.label}-${index}`}
            onPress={() => Alert.alert('Demo', `Would redirect to ${option.label}`)}
            className="flex-row items-center gap-2.5 rounded-xl bg-sand-light p-3.5"
          >
            <Icon spec={option.icon} size={18} />
            <Text className="text-sm font-bold text-ink">{option.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
