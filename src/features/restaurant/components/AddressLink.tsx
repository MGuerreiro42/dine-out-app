import { Pressable, Text } from 'react-native';

import { Icon } from '@/components/ui';
import { useLinkChooser } from '@/features/restaurant/hooks/useLinkChooser';
import { resolveMapOptions } from '@/features/restaurant/lib/externalLinks';
import { colors, iconSize } from '@/theme';

import { LinkChooserSheet } from './LinkChooserSheet';

type AddressLinkProps = {
  latitude: number;
  longitude: number;
  name: string;
  addressShort: string;
};

export function AddressLink({ latitude, longitude, name, addressShort }: AddressLinkProps) {
  const chooser = useLinkChooser();

  return (
    <>
      <Pressable
        onPress={() => chooser.choose(() => resolveMapOptions(latitude, longitude, name))}
        className="flex-row items-center gap-xs"
      >
        <Icon spec={{ set: 'Ionicons', name: 'location-outline' }} size={iconSize.inline} color={colors.rating} />
        <Text className="text-body text-ink">{addressShort}</Text>
      </Pressable>
      <LinkChooserSheet title="Open in" options={chooser.options} onClose={chooser.close} />
    </>
  );
}
