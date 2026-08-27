import { useRouter } from 'expo-router';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';

import { Icon, type IconSpec, PhotoPlaceholder } from '@/components/ui';
import { useDiscoveryTaxonomiesQuery } from '@/features/search/api';
import { AMBIENT_ICONS, DEFAULT_AMBIENT_ICON } from '@/features/search/lib/taxonomyIcons';
import type { Ambient, Cuisine, Occasion } from '@/features/search/types';

export type TypeOverviewDimension = 'cuisine' | 'occasion' | 'ambient';

type TypeOverviewScreenProps = {
  dimension: TypeOverviewDimension;
};

const DIMENSION_COPY: Record<TypeOverviewDimension, { title: string; subject: string }> = {
  cuisine: { title: 'Cuisines', subject: 'cuisine' },
  occasion: { title: 'Occasions', subject: 'occasion' },
  ambient: { title: 'Ambients', subject: 'ambient' },
};

type TypeOverviewItem = Cuisine | Occasion | Ambient;

function getIconSpec(dimension: TypeOverviewDimension, item: TypeOverviewItem): IconSpec {
  if (dimension === 'occasion') {
    return (item as Occasion).icon;
  }
  return AMBIENT_ICONS[item.id] ?? DEFAULT_AMBIENT_ICON;
}

export function TypeOverviewScreen({ dimension }: TypeOverviewScreenProps) {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useDiscoveryTaxonomiesQuery();

  const items: TypeOverviewItem[] =
    dimension === 'cuisine' ? (data?.cuisines ?? []) : dimension === 'occasion' ? (data?.occasions ?? []) : (data?.ambients ?? []);

  const goToDetail = (item: TypeOverviewItem) => {
    router.push(`/type/${dimension}/${item.id}`);
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center gap-3 bg-white px-8">
        <Text className="text-center text-sm text-muted">Couldn't load categories.</Text>
        <Pressable onPress={() => refetch()} className="rounded-xl bg-ink px-4 py-2.5">
          <Text className="text-sm font-bold text-white">Try again</Text>
        </Pressable>
      </View>
    );
  }

  const copy = DIMENSION_COPY[dimension];

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 24 }}>
      <View className="flex-row items-center gap-2.5 px-4 pt-4">
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          className="h-10 w-10 items-center justify-center rounded-full bg-[#f3f4f6]"
        >
          <Icon spec={{ set: 'Ionicons', name: 'chevron-back' }} size={18} color="#1f2937" />
        </Pressable>
        <Pressable
          onPress={() => router.push('/search')}
          className="flex-1 flex-row items-center gap-2 rounded-full bg-[#f3f4f6] px-4 py-3"
        >
          <Icon spec={{ set: 'Ionicons', name: 'search-outline' }} size={16} color="#9ca3af" />
          <Text className="flex-1 text-sm text-[#9ca3af]">Search restaurants...</Text>
        </Pressable>
        <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-[#f3f4f6]">
          <Icon spec={{ set: 'Ionicons', name: 'person-outline' }} size={18} color="#1f2937" />
        </Pressable>
      </View>

      <View className="px-4 pt-4">
        <Text className="text-xl font-bold text-ink">
          All <Text className="text-accent">{copy.title}</Text>
        </Text>
        <Text className="mt-1 text-sm text-[#6b7280]">Choose a {copy.subject} to explore</Text>
      </View>

      <View className="flex-row flex-wrap justify-between gap-y-4 px-4 pt-3.5">
        {items.map((item) =>
          dimension === 'cuisine' ? (
            <Pressable key={item.id} onPress={() => goToDetail(item)} className="w-[48%] md:w-[31%] lg:w-[23%]">
              <View className="aspect-square overflow-hidden rounded-2xl">
                {(item as Cuisine).photos[0] ? (
                  <Image source={{ uri: (item as Cuisine).photos[0] }} className="h-full w-full" />
                ) : (
                  <PhotoPlaceholder />
                )}
                <View className="absolute inset-0 bg-black/30" />
                <Text className="absolute bottom-2.5 left-2.5 text-sm font-bold text-white">{item.label}</Text>
              </View>
            </Pressable>
          ) : (
            <Pressable key={item.id} onPress={() => goToDetail(item)} className="w-[48%] md:w-[31%] lg:w-[23%]">
              <View className="aspect-square items-center justify-center rounded-2xl bg-[#eef2ff]">
                <Icon spec={getIconSpec(dimension, item)} size={40} color="#4f46e5" />
                <Text className="mt-1.5 text-center text-sm font-bold text-[#111827]">{item.label}</Text>
              </View>
            </Pressable>
          ),
        )}
      </View>
    </ScrollView>
  );
}
