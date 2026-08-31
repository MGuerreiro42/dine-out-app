import { useRouter } from 'expo-router';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';

import { Icon, type IconSpec, PhotoPlaceholder } from '@/components/ui';
import { useDiscoveryTaxonomiesQuery } from '@/features/search/api';
import { AMBIENT_ICONS, DEFAULT_AMBIENT_ICON } from '@/features/search/lib/taxonomyIcons';
import type { Ambient, Cuisine, Occasion } from '@/features/search/types';
import { colors, iconSize } from '@/theme';

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
      <View className="flex-1 items-center justify-center gap-sm2 bg-white px-xl">
        <Text className="text-center text-sm text-muted">Couldn't load categories.</Text>
        <Pressable onPress={() => refetch()} className="rounded-lg bg-ink px-md py-sm2">
          <Text className="text-sm font-bold text-white">Try again</Text>
        </Pressable>
      </View>
    );
  }

  const copy = DIMENSION_COPY[dimension];

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 24 }}>
      <View className="flex-row items-center gap-sm2 px-md pt-md">
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          className="h-10 w-10 items-center justify-center rounded-full bg-sand"
        >
          <Icon spec={{ set: 'Ionicons', name: 'chevron-back' }} size={iconSize.ui} color={colors.ink} />
        </Pressable>
        <Pressable
          onPress={() => router.push('/search')}
          className="flex-1 flex-row items-center gap-sm rounded-full bg-sand px-md py-sm2"
        >
          <Icon spec={{ set: 'Ionicons', name: 'search-outline' }} size={iconSize.inline} color={colors.inkSubtle} />
          <Text className="flex-1 text-sm text-ink-subtle">Search restaurants...</Text>
        </Pressable>
        <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-sand">
          <Icon spec={{ set: 'Ionicons', name: 'person-outline' }} size={iconSize.ui} color={colors.ink} />
        </Pressable>
      </View>

      <View className="px-md pt-md">
        <Text className="text-xl font-bold text-ink">
          All <Text className="text-accent">{copy.title}</Text>
        </Text>
        <Text className="mt-xs text-sm text-muted">Choose a {copy.subject} to explore</Text>
      </View>

      <View className="flex-row flex-wrap justify-between gap-y-md px-md pt-md">
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
                <Text className="absolute bottom-sm2 left-sm2 text-sm font-bold text-white">{item.label}</Text>
              </View>
            </Pressable>
          ) : (
            <Pressable key={item.id} onPress={() => goToDetail(item)} className="w-[48%] md:w-[31%] lg:w-[23%]">
              <View className="aspect-square items-center justify-center rounded-2xl bg-accent-tint">
                <Icon spec={getIconSpec(dimension, item)} size={iconSize.empty} color={colors.accent} />
                <Text className="mt-sm text-center text-sm font-bold text-ink">{item.label}</Text>
              </View>
            </Pressable>
          ),
        )}
      </View>
    </ScrollView>
  );
}
