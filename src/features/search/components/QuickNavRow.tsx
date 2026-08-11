import { type Href, useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/ui';
import { useDiscoveryTaxonomiesQuery } from '@/features/search/api/useDiscoveryTaxonomiesQuery';

export function QuickNavRow() {
  const router = useRouter();
  const { data: taxonomies } = useDiscoveryTaxonomiesQuery();
  const venueTypes = taxonomies?.venueTypes ?? [];

  return (
    <View className="flex-row justify-around px-4 pb-1 pt-3.5">
      {venueTypes.map((venueType) => (
        <Pressable
          key={venueType.id}
          onPress={() => router.push(`/venue-type/${venueType.id}` as Href)}
          className="items-center gap-1.5"
        >
          <View className="h-[52px] w-[52px] items-center justify-center rounded-full bg-sand">
            <Icon spec={venueType.icon} size={22} />
          </View>
          <Text className="text-[11px] font-bold text-ink">{venueType.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}
