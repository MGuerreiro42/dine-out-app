import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Animated, Image, Pressable, ScrollView, Text, View } from 'react-native';

import { AppHeader } from '@/components/layout';
import {
  BottomSheet,
  CarouselArrows,
  CarouselDots,
  Chip,
  ErrorState,
  Icon,
  type IconSpec,
  LoadingState,
  PhotoPlaceholder,
  SectionHeader,
} from '@/components/ui';
import { RestaurantSection } from '@/features/search/components/RestaurantSection';
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

type RefineSectionProps = {
  refine: RefineData;
  onPressRestaurant: (restaurant: HomeCardData) => void;
  onViewAll?: () => void;
};

function RefineSection({ refine, onPressRestaurant, onViewAll }: RefineSectionProps) {
  const { heading, icon } = REFINE_HEADERS[refine.dimension];

  return (
    <View>
      <SectionHeader icon={icon} title={heading} viewAll={onViewAll ? { onPress: onViewAll } : undefined} />
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
      <RestaurantSection restaurants={refine.results} onSelectRestaurant={onPressRestaurant} />
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
      <SectionHeader icon={{ set: 'Ionicons', name: 'pricetags-outline' }} title="Browse by Type" />
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
        {hasMultiple ? <CarouselArrows onPrev={goPrev} onNext={goNext} /> : null}
      </View>
      {hasMultiple ? <CarouselDots count={champions.length} activeIndex={index} /> : null}
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
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState message="Couldn't load this page." onRetry={() => refetch()} />;
  }

  const lastSectionHeader: { heading: string; icon: IconSpec } =
    dimension === 'cuisine'
      ? { heading: 'Best Deliveries', icon: { set: 'Ionicons', name: 'bag-outline' } }
      : { heading: `${primaryLabel} Near You`, icon: { set: 'Ionicons', name: 'location-outline' } };

  return (
    <View className="flex-1 bg-white">
      <AppHeader search={{ mode: 'input', value: searchText, onChangeText: setSearchText }} showBack />

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="px-md pt-lg text-2xl font-bold text-ink">{primaryLabel}</Text>

        {champions.length ? <ChampionCard champions={champions} /> : null}

        <SectionHeader
          icon={{ set: 'MaterialCommunityIcons', name: 'crown-outline' }}
          title="Champions - Best Rated"
          viewAll={{ onPress: () => id && goToSearch({ [dimension]: id }) }}
        />
        <RestaurantSection restaurants={champions} onSelectRestaurant={goToRestaurant} />

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
          viewAll={{ onPress: () => id && goToSearch({ [dimension]: id }) }}
        />
        <RestaurantSection restaurants={trending} onSelectRestaurant={goToRestaurant} />

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
          viewAll={{ onPress: () => id && goToSearch({ [dimension]: id }) }}
        />
        <RestaurantSection restaurants={lastSection} onSelectRestaurant={goToRestaurant} />
      </ScrollView>
    </View>
  );
}
