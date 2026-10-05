import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/ui';
import { type LinkOption, openExternalUrl } from '@/features/restaurant/lib/externalLinks';

type RedirectOptionsSheetContentProps = {
  title: string;
  options: LinkOption[];
  onOpened: () => void;
};

export function RedirectOptionsSheetContent({ title, options, onOpened }: RedirectOptionsSheetContentProps) {
  return (
    <View>
      <Text className="mb-md text-lg font-bold text-ink">{title}</Text>
      {options.map((option) => (
        <Pressable
          key={option.url}
          onPress={async () => {
            if (await openExternalUrl(option.url)) {
              onOpened();
            }
          }}
          className="mb-sm2 flex-row items-center gap-sm2 rounded-lg bg-sand-light p-md"
        >
          <Icon spec={option.icon} />
          <Text className="text-sm font-bold text-ink">{option.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}
