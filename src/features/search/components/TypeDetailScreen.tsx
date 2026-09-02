import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Animated, Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { BottomSheet, Chip, HorizontalRail, Icon, PhotoPlaceholder, type IconSpec } from '@/components/ui';
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
import { colors, iconSize } from '@/theme';

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
    <View className="flex-row items-center justify-between px-md pb-sm pt-lg">
      <View className="flex-row items-center gap-sm">
        <Icon spec={icon} size={iconSize.inline} color={colors.accent} />
        <Text className="text-lg font-bold text-ink">{title}</Text>
      </View>
      <Pressable onPress={onViewAll}>
        <Text className="text-xs font-normal text-accent">View all</Text>
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
          <Pressable key={option.id} onPress={() => refine.setActive(option.id)} className="items-center gap-sm">
            <View
              className={`h-11 w-11 items-center justify-center rounded-full ${option.isActive ? 'bg-accent-tint' : 'bg-sand'}`}
            >
              <Icon
                spec={refineOptionIcon(refine.dimension, option)}
                size={iconSize.ui}
                color={option.isActive ? colors.accent : colors.ink}
              />
            </View>
            <Text className={`text-caption font-bold ${option.isActive ? 'text-ink' : 'text-muted'}`}>
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

type SubtypeRowProps = {
  subtypes: ReturnType<typeof useTypeDetail>['subtypes'];
};

function SubtypeRow({ subtypes }: SubtypeRowProps) {
  const [openLabel, setOpenLabel] = useState<string | null>(null);

  if (subtypes.length === 0) return null;

  return (
    <View>
      <View className="flex-row items-center gap-sm px-md pb-sm pt-lg">
        <Icon spec={{ set: 'Ionicons', name: 'pricetags-outline' }} size={iconSize.inline} color={colors.accent} />
        <Text className="text-lg font-bold text-ink">Browse by Type</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}
      >
        {subtypes.map((subtype) => (
          <Chip key={subtype.label} label={subtype.label} onPress={() => setOpenLabel(subtype.label)} />
        ))}
      </ScrollView>

      <BottomSheet visible={openLabel !== null} onClose={() => setOpenLabel(null)}>
        <Text className="text-lg font-bold text-ink">{openLabel}</Text>
        <Text className="mt-sm text-sm text-muted">Filtering by {openLabel} is coming soon.</Text>
      </BottomSheet>
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
    <View className="mx-md mt-md overflow-hidden rounded-lg bg-white shadow-md shadow-black/10">
      <View className="relative aspect-[4/3] overflow-hidden" onLayout={onLayout}>
        {champion.photo ? (
          <Animated.View
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, transform: [{ translateX }] }}
          >
            <Image source={{ uri: champion.photo }} className="h-full w-full" />
          </Animated.View>
        ) : (
          <PhotoPlaceholder iconSize={iconSize.header} />
        )}
        <View className="absolute left-md top-md rounded-full bg-[#fef3c7] px-sm2 py-xs">
          <Text className="text-caption font-bold text-[#b45309]">Champion</Text>
        </View>
        {hasMultiple ? (
          <>
            <Pressable
              onPress={goPrev}
              className="absolute left-sm2 top-1/2 h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40"
            >
              <Icon spec={{ set: 'Ionicons', name: 'chevron-back' }} size={iconSize.ui} color={colors.white} />
            </Pressable>
            <Pressable
              onPress={goNext}
              className="absolute right-sm2 top-1/2 h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40"
            >
              <Icon spec={{ set: 'Ionicons', name: 'chevron-forward' }} size={iconSize.ui} color={colors.white} />
            </Pressable>
          </>
        ) : null}
      </View>
      {hasMultiple ? (
        <View className="mt-sm2 flex-row items-center justify-center gap-sm">
          {champions.map((c, dotIndex) => (
            <View
              key={c.id}
              className={`h-1.5 rounded-full ${dotIndex === index ? 'w-4 bg-accent-pressed' : 'w-1.5 bg-sand-border'}`}
            />
          ))}
        </View>
      ) : null}
      <View className="p-md">
        <Text className="text-lg font-bold text-ink">{champion.name}</Text>
        {champion.rating !== null ? (
          <Text className="mt-xs text-xs text-muted">
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
  const { isLoading, isError, refetch, primaryLabel, champions, trending, lastSection, subtypes, refine1, refine2 } =
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
      <View className="flex-1 items-center justify-center gap-sm2 bg-white px-xl">
        <Text className="text-center text-sm text-muted">Couldn't load this page.</Text>
        <Pressable onPress={() => refetch()} className="rounded-lg bg-ink px-md py-sm2">
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
      <View className="flex-row items-center gap-sm2 px-md pt-md">
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          className="h-10 w-10 items-center justify-center rounded-full bg-sand"
        >
          <Icon spec={{ set: 'Ionicons', name: 'chevron-back' }} size={iconSize.ui} color={colors.ink} />
        </Pressable>
        <View className="flex-1 flex-row items-center gap-sm rounded-full bg-sand px-md py-sm2">
          <Icon spec={{ set: 'Ionicons', name: 'search-outline' }} size={iconSize.inline} color={colors.inkSubtle} />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search restaurants..."
            placeholderTextColor={colors.inkSubtle}
            className="flex-1 text-sm text-ink"
          />
        </View>
        <Pressable
          onPress={() => router.push('/profile')}
          className="h-10 w-10 items-center justify-center rounded-full bg-sand"
        >
          <Icon spec={{ set: 'Ionicons', name: 'person-outline' }} size={iconSize.ui} color={colors.ink} />
        </Pressable>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="px-md pt-lg text-2xl font-bold text-ink">{primaryLabel}</Text>

        {champions.length ? <ChampionCard champions={champions} /> : null}

        <SectionHeader
          icon={{ set: 'MaterialCommunityIcons', name: 'crown-outline' }}
          title="Champions - Best Rated"
          onViewAll={() => id && goToSearch({ [dimension]: id })}
        />
        <RestaurantGrid restaurants={champions} onPress={goToRestaurant} />

        {dimension === 'cuisine' ? (
          <SubtypeRow subtypes={subtypes} />
        ) : (
          <RefineSection
            refine={refine1}
            onPressRestaurant={goToRestaurant}
            onViewAll={() => {
              const refineId = refine1.options.find((option) => option.isActive)?.id;
              if (refineId) goToSearch({ [refine1.dimension]: refineId });
            }}
          />
        )}

        <SectionHeader
          icon={{ set: 'Ionicons', name: 'flame-outline' }}
          title="On Fire - Trending"
          onViewAll={() => id && goToSearch({ [dimension]: id })}
        />
        <RestaurantGrid restaurants={trending} onPress={goToRestaurant} />

        {dimension === 'cuisine' ? null : (
          <RefineSection
            refine={refine2}
            onPressRestaurant={goToRestaurant}
            onViewAll={() => {
              const refineId = refine2.options.find((option) => option.isActive)?.id;
              if (refineId) goToSearch({ [refine2.dimension]: refineId });
            }}
          />
        )}

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
