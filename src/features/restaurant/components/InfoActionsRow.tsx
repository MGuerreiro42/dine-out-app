import { Alert, Pressable, Text, View } from 'react-native';

import { Icon, type IconSpec } from '@/components/ui';
import { getSocialLinkIcon, getSocialLinkLabel, getWebsiteLabel } from '@/features/restaurant/lib/labels';
import { colors, iconSize } from '@/theme';

type InfoActionsRowProps = {
  phones: string[];
  whatsapp: string | null;
  instagramHandle: string | null;
  websites: string[];
  socialLinks: string[];
};

type ContactCard = {
  icon: IconSpec;
  label: string;
  value: string | null;
};

export function InfoActionsRow({ phones, whatsapp, instagramHandle, websites, socialLinks }: InfoActionsRowProps) {
  const socialCard: Pick<ContactCard, 'icon' | 'label' | 'value'> = instagramHandle
    ? { icon: { set: 'Ionicons', name: 'logo-instagram' }, label: 'Instagram', value: instagramHandle }
    : socialLinks.length > 0
      ? { icon: getSocialLinkIcon(socialLinks[0]), label: getSocialLinkLabel(socialLinks[0]), value: socialLinks[0] }
      : { icon: { set: 'Ionicons', name: 'share-social-outline' }, label: 'Social', value: null };

  const cards: ContactCard[] = [
    { icon: { set: 'Ionicons', name: 'call-outline' }, label: 'Phone', value: phones[0] ?? null },
    {
      icon: { set: 'Ionicons', name: 'globe-outline' },
      label: 'Website',
      value: websites[0] ? getWebsiteLabel(websites[0]) : null,
    },
    socialCard,
    { icon: { set: 'Ionicons', name: 'logo-whatsapp' }, label: 'WhatsApp', value: whatsapp },
  ];

  return (
    <View className="px-md pb-md">
      <Text className="mb-sm2 text-lg font-bold text-ink">How to reach them</Text>
      <View className="flex-row flex-wrap gap-sm2">
        {cards.map((card) => {
          const hasValue = card.value !== null;
          return (
            <Pressable
              key={card.label}
              onPress={hasValue ? () => Alert.alert('Demo', `Would redirect to ${card.label}: ${card.value}`) : undefined}
              disabled={!hasValue}
              className={`flex-1 basis-[45%] flex-row items-center gap-sm rounded-lg p-md ${
                hasValue ? 'bg-sand-light' : 'bg-sand-light opacity-60'
              }`}
            >
              <View className="h-9 w-9 items-center justify-center rounded-full bg-white">
                <Icon spec={card.icon} size={iconSize.inline} color={hasValue ? colors.ink : colors.inkFaint} />
              </View>
              <View className="flex-1">
                <Text className="text-caption text-muted">{card.label}</Text>
                <Text className="text-xs font-bold text-ink" numberOfLines={1}>
                  {card.value ?? 'Not provided'}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
