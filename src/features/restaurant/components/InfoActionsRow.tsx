import { Pressable, Text, View } from 'react-native';

import { Icon, type IconSpec } from '@/components/ui';
import { openExternalUrl, toInstagramUrl, toTelUrl } from '@/features/restaurant/lib/externalLinks';
import { getSocialLinkIcon, getSocialLinkLabel, getWebsiteLabel } from '@/features/restaurant/lib/labels';
import { colors, iconSize } from '@/theme';

type InfoActionsRowProps = {
  phones: string[];
  whatsappUrl: string | null;
  instagramHandle: string | null;
  websites: string[];
  socialLinks: string[];
};

type ContactCard = {
  icon: IconSpec;
  label: string;
  link: { text: string; url: string } | null;
};

function getSocialCard(instagramHandle: string | null, socialLink: string | undefined): ContactCard {
  const url = instagramHandle ? toInstagramUrl(instagramHandle) : socialLink;
  if (!url) {
    return { icon: { set: 'Ionicons', name: 'share-social-outline' }, label: 'Social', link: null };
  }
  return {
    icon: getSocialLinkIcon(url),
    label: getSocialLinkLabel(url),
    link: { text: instagramHandle ?? url, url },
  };
}

export function InfoActionsRow({ phones, whatsappUrl, instagramHandle, websites, socialLinks }: InfoActionsRowProps) {
  const [phone] = phones;
  const [website] = websites;

  const cards: ContactCard[] = [
    {
      icon: { set: 'Ionicons', name: 'call-outline' },
      label: 'Phone',
      link: phone ? { text: phone, url: toTelUrl(phone) } : null,
    },
    {
      icon: { set: 'Ionicons', name: 'globe-outline' },
      label: 'Website',
      link: website ? { text: getWebsiteLabel(website), url: website } : null,
    },
    getSocialCard(instagramHandle, socialLinks[0]),
    {
      icon: { set: 'Ionicons', name: 'logo-whatsapp' },
      label: 'WhatsApp',
      link: whatsappUrl ? { text: 'Send a message', url: whatsappUrl } : null,
    },
  ];

  return (
    <View className="px-md pb-md">
      <Text className="mb-sm2 text-lg font-bold text-ink">How to reach them</Text>
      <View className="flex-row flex-wrap gap-sm2">
        {cards.map(({ icon, label, link }) => (
          <Pressable
            key={label}
            onPress={link ? () => openExternalUrl(link.url) : undefined}
            disabled={!link}
            className={`flex-1 basis-[45%] flex-row items-center gap-sm rounded-lg p-md ${
              link ? 'bg-sand-light' : 'bg-sand-light opacity-60'
            }`}
          >
            <View className="h-9 w-9 items-center justify-center rounded-full bg-white">
              <Icon spec={icon} size={iconSize.inline} color={link ? colors.ink : colors.inkFaint} />
            </View>
            <View className="flex-1">
              <Text className="text-caption text-muted">{label}</Text>
              <Text className="text-xs font-bold text-ink" numberOfLines={1}>
                {link?.text ?? 'Not provided'}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
