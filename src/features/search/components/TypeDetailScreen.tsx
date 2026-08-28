import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Animated, Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { HorizontalRail, Icon, PhotoPlaceholder, type IconSpec } from '@/components/ui';
import { HomeRestaurantCard } from '@/features/search/components/HomeRestaurantCard';
import { useDebouncedValue } from '@/features/search/hooks/useDebouncedValue';
import type { HomeCardData } from '@/features/search/hooks/useHomeDiscovery';
import { type TaxonomyDimension, useTypeDetail } from '@/features/search/hooks/useTypeDetail';
import {
  AMBIENT_ICONS,
  CUISINE_ICONS,
  DEFAULT_AMBIENT_ICON,
  DEFAULT_CUISINE_ICON,
} from '@/features/search/lib/taxonomyIcons';
import type { Occasion } from '@/features/search/types';
import { useCarouselIndex, useSlideAnimation } from '@/hooks';

type TypeDetailScreenProps = {
  dimension: TaxonomyDimension;
  id: string | undefined;
};

type RefineData = ReturnType<typeof useTypeDetail>['refine1'];
type RefineOption = RefineData['options'][number];

const REFINE_HEADERS: Record<TaxonomyDimension, { heading: string; icon: IconSpec }> = {
  cuisine: { heading: 'Choose your Cuisine', icon: { set: 'Ionicons', name: 'restaurant-outline' } },
  occasion: { heading: 'Perfect for the Occasion', icon: { set: 'Ionicons', name: 'sparkles' } },
  ambient: { heading: 'Outstanding Ambients', icon: { set: 'Ionicons', name: 'star-outline' } },
};

function refineOptionIcon(dimension: TaxonomyDimension, option: RefineOption): IconSpec {
  if (dimension === 'occasion') return (option as Occasion).icon;
  if (dimension === 'cuisine') return CUISINE_ICONS[option.id] ?? DEFAULT_CUISINE_ICON;
  return AMBIENT_ICONS[option.id] ?? DEFAULT_AMBIENT_ICON;
}

type SectionHeaderProps = {
  icon: IconSpec;
  title: string;
  onViewAll?: () => void;
};

function SectionHeader({ icon, title, onViewAll }: SectionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-4 pb-2 pt-6">
      <View className="flex-row items-center gap-1.5">
        <Icon spec={icon} size={16} color="#4f46e5" />
        <Text className="text-[17px] font-bold text-[#111827]">{title}</Text>
      </View>
      <Pressable onPress={onViewAll}>
        <Text className="text-xs font-normal text-[#4f46e5]">View all</Text>
      </Pressable>
    </View>
  );
}

type RestaurantGridProps = {
  restaurants: HomeCardData[];
  onPress: (restaurant: HomeCardData) => void;
};

function RestaurantGrid({ restaurants, onPress }: RestaurantGridProps) {
  return (
    <HorizontalRail>
      {restaurants.map((restaurant) => (
        <HomeRestaurantCard key={restaurant.id} restaurant={restaurant} onPress={onPress} />
      ))}
    </HorizontalRail>
  );
}

type RefineSectionProps = {
  refine: RefineData;
  onPressRestaurant: (restaurant: HomeCardData) => void;
  onViewAll?: () => void;
};

function RefineSection({ refine, onPressRestaurant, onViewAll }: RefineSectionProps) {
  const { heading, icon } = REFINE_HEADERS[refine.dimension];

  return (
    <View>
      <SectionHeader icon={icon} title={heading} onViewAll={onViewAll} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 16, paddingHorizontal: 16, paddingVertical: 4 }}
      >
        {refine.options.map((option) => (
          <Pressable key={option.id} onPress={() => refine.setActive(option.id)} className="items-center gap-1.5">
            <View
              className={`h-11 w-11 items-center justify-center rounded-full ${option.isActive ? 'bg-[#eef2ff]' : 'bg-[#f3f4f6]'}`}
            >
              <Icon
                spec={refineOptionIcon(refine.dimension, option)}
                size={18}
                color={option.isActive ? '#4f46e5' : '#1f2937'}
              />
            </View>
            <Text className={`text-[13px] font-bold ${option.isActive ? 'text-[#111827]' : 'text-[#6b7280]'}`}>
              {option.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      <View className="mt-sm">
        <RestaurantGrid restaurants={refine.results} onPress={onPressRestaurant} />
      </View>
    </View>
  );
}

type ChampionCardProps = {
  champions: HomeCardData[];
};

function ChampionCard({ champions }: ChampionCardProps) {
  const { index, direction, goPrev, goNext } = useCarouselIndex(champions.length);
  const { onLayout, translateX } = useSlideAnimation(index, direction);
  const hasMultiple = champions.length > 1;
  const champion = champions[index];

  if (!champion) return null;

  return (
    <View className="mx-4 mt-md overflow-hidden rounded-xl bg-white shadow-md shadow-black/10">
      <View className="relative aspect-[4/3] overflow-hidden" onLayout={onLayout}>
        {champion.photo ? (
          <Animated.View
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, transform: [{ translateX }] }}
          >
            <Image source={{ uri: champion.photo }} className="h-full w-full" />
          </Animated.View>
        ) : (
          <PhotoPlaceholder iconSize={24} />
        )}
        <View className="absolute left-3.5 top-3.5 rounded-full bg-[#fef3c7] px-2.5 py-1">
          <Text className="text-[12px] font-bold text-[#b45309]">Champion</Text>
        </View>
        {hasMultiple ? (
          <>
            <Pressable
              onPress={goPrev}
              className="absolute left-2.5 top-1/2 h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40"
            >
              <Icon spec={{ set: 'Ionicons', name: 'chevron-back' }} size={18} color="#fff" />
            </Pressable>
            <Pressable
              onPress={goNext}
              className="absolute right-2.5 top-1/2 h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40"
            >
              <Icon spec={{ set: 'Ionicons', name: 'chevron-forward' }} size={18} color="#fff" />
            </Pressable>
          </>
        ) : null}
      </View>
      {hasMultiple ? (
        <View className="mt-2.5 flex-row items-center justify-center gap-1.5">
          {champions.map((c, dotIndex) => (
            <View
              key={c.id}
              className={`h-1.5 rounded-full ${dotIndex === index ? 'w-4 bg-[#6366f1]' : 'w-1.5 bg-[#e5e7eb]'}`}
            />
          ))}
        </View>
      ) : null}
      <View className="p-3.5">
        <Text className="text-lg font-bold text-ink">{champion.name}</Text>
        {champion.rating !== null ? (
          <Text className="mt-xs text-xs text-[#6b7280]">
            ★ {champion.rating}
            {champion.reviewCount !== null ? ` · ${champion.reviewCount} reviews` : ''}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

export function TypeDetailScreen({ dimension, id }: TypeDetailScreenProps) {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const debouncedSearchText = useDebouncedValue(searchText);
  const { isLoading, isError, refetch, primaryLabel, champions, trending, lastSection, refine1, refine2 } =
    useTypeDetail(dimension, id, debouncedSearchText);

  const goToRestaurant = (restaurant: HomeCardData) => {
    router.push(`/restaurant/${restaurant.id}`);
  };

  const goToSearch = (filters: Partial<Record<TaxonomyDimension, string>>) => {
    router.push({ pathname: '/search', params: filters });
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
        <Text className="text-center text-sm text-muted">Couldn't load this page.</Text>
        <Pressable onPress={() => refetch()} className="rounded-xl bg-ink px-4 py-2.5">
          <Text className="text-sm font-bold text-white">Try again</Text>
        </Pressable>
      </View>
    );
  }

  const lastSectionHeader: { heading: string; icon: IconSpec } =
    dimension === 'cuisine'
      ? { heading: 'Best Deliveries', icon: { set: 'Ionicons', name: 'bag-outline' } }
      : { heading: `${primaryLabel} Near You`, icon: { set: 'Ionicons', name: 'location-outline' } };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center gap-2.5 px-4 pt-4">
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          className="h-10 w-10 items-center justify-center rounded-full bg-[#f3f4f6]"
        >
          <Icon spec={{ set: 'Ionicons', name: 'chevron-back' }} size={18} color="#1f2937" />
        </Pressable>
        <View className="flex-1 flex-row items-center gap-2 rounded-full bg-[#f3f4f6] px-4 py-3">
          <Icon spec={{ set: 'Ionicons', name: 'search-outline' }} size={16} color="#9ca3af" />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search restaurants..."
            placeholderTextColor="#9ca3af"
            className="flex-1 text-sm text-[#111827]"
          />
        </View>
        <Pressable
          onPress={() => router.push('/profile')}
          className="h-10 w-10 items-center justify-center rounded-full bg-[#f3f4f6]"
        >
          <Icon spec={{ set: 'Ionicons', name: 'person-outline' }} size={18} color="#1f2937" />
        </Pressable>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="px-4 pt-lg text-2xl font-bold text-ink">{primaryLabel}</Text>

        {champions.length ? <ChampionCard champions={champions} /> : null}

        <SectionHeader
          icon={{ set: 'MaterialCommunityIcons', name: 'crown-outline' }}
          title="Champions - Best Rated"
          onViewAll={() => id && goToSearch({ [dimension]: id })}
        />
        <RestaurantGrid restaurants={champions} onPress={goToRestaurant} />

        <RefineSection
          refine={refine1}
          onPressRestaurant={goToRestaurant}
          onViewAll={() => {
            const refineId = refine1.options.find((option) => option.isActive)?.id;
            if (refineId) goToSearch({ [refine1.dimension]: refineId });
          }}
        />

        <SectionHeader
          icon={{ set: 'Ionicons', name: 'flame-outline' }}
          title="On Fire - Trending"
          onViewAll={() => id && goToSearch({ [dimension]: id })}
        />
        <RestaurantGrid restaurants={trending} onPress={goToRestaurant} />

        <RefineSection
          refine={refine2}
          onPressRestaurant={goToRestaurant}
          onViewAll={() => {
            const refineId = refine2.options.find((option) => option.isActive)?.id;
            if (refineId) goToSearch({ [refine2.dimension]: refineId });
          }}
        />

        <SectionHeader
          icon={lastSectionHeader.icon}
          title={lastSectionHeader.heading}
          onViewAll={() => id && goToSearch({ [dimension]: id })}
        />
        <RestaurantGrid restaurants={lastSection} onPress={goToRestaurant} />
      </ScrollView>
    </View>
  );
}
