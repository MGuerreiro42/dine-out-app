import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';

import { EmptyState, Icon, type IconSpec } from '@/components/ui';
import { useDiscoveryTaxonomiesQuery } from '@/features/search/api';
import { LocationHeader, MapResultCard } from '@/features/search/components';
import { useDebouncedValue, useSearchMapDiscovery } from '@/features/search/hooks';
import type { MapResultData } from '@/features/search/hooks';
import { compareByRating } from '@/features/search/lib/ratingSort';

type TaxonomyDimension = 'cuisine' | 'occasion' | 'ambient';
type ActiveFilters = Partial<Record<TaxonomyDimension, string>>;

type SortKey = 'top_rated' | 'trending';

type FilterMenuView = 'root' | 'cuisine' | 'occasion' | 'ambient' | 'features';

type FeatureKey = 'vegetarian' | 'groups' | 'kids' | 'outdoor';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'top_rated', label: 'Top Rated' },
  { key: 'trending', label: 'Trending' },
];

const FILTER_CATEGORIES: { icon: IconSpec; label: string; dimension: FilterMenuView | 'delivery' }[] = [
  { icon: { set: 'Ionicons', name: 'restaurant-outline' }, label: 'Cuisine', dimension: 'cuisine' },
  { icon: { set: 'Ionicons', name: 'wine-outline' }, label: 'Ambient', dimension: 'ambient' },
  { icon: { set: 'Ionicons', name: 'sparkles-outline' }, label: 'Occasion', dimension: 'occasion' },
  { icon: { set: 'Ionicons', name: 'star-outline' }, label: 'Features', dimension: 'features' },
  { icon: { set: 'MaterialCommunityIcons', name: 'moped-outline' }, label: 'Delivery', dimension: 'delivery' },
];

const FEATURE_OPTIONS: { key: FeatureKey; label: string; matches: (restaurant: MapResultData) => boolean }[] = [
  { key: 'vegetarian', label: 'Vegetariano', matches: (restaurant) => restaurant.servesVegetarianFood },
  { key: 'groups', label: 'Bom para grupos', matches: (restaurant) => restaurant.goodForGroups },
  { key: 'kids', label: 'Kids friendly', matches: (restaurant) => restaurant.goodForChildren },
  { key: 'outdoor', label: 'Outdoor seating', matches: (restaurant) => restaurant.outdoorSeating },
];

const FILTER_MENU_TITLES: Record<Exclude<FilterMenuView, 'root'>, string> = {
  cuisine: 'Cuisine',
  occasion: 'Occasion',
  ambient: 'Ambient',
  features: 'Features',
};

const sortResults = (results: MapResultData[], sortBy: SortKey) =>
  [...results].sort((a, b) => {
    switch (sortBy) {
      case 'top_rated':
        return compareByRating(a.rating, b.rating);
      case 'trending':
        return a.id - b.id;
      default:
        return 0;
    }
  });

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ cuisine?: string; occasion?: string; ambient?: string; delivery?: string }>();
  const [searchText, setSearchText] = useState('');
  const debouncedSearchText = useDebouncedValue(searchText);
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    cuisine: params.cuisine,
    occasion: params.occasion,
    ambient: params.ambient,
  });
  const { isLoading, isFetching, isError, refetch, results } = useSearchMapDiscovery(debouncedSearchText, {
    cuisine: activeFilters.cuisine,
    occasion: activeFilters.occasion,
  });
  const { data: taxonomies } = useDiscoveryTaxonomiesQuery();
  const [deliveryOnly, setDeliveryOnly] = useState(params.delivery === '1');
  const [activeFeatures, setActiveFeatures] = useState<FeatureKey[]>([]);
  const [sortBy, setSortBy] = useState<SortKey>('top_rated');
  const [openMenu, setOpenMenu] = useState<'sort' | 'filters' | null>(null);
  const [filterMenuView, setFilterMenuView] = useState<FilterMenuView>('root');
  const [sortAnchor, setSortAnchor] = useState({ top: 0, right: 0 });
  const [filtersAnchor, setFiltersAnchor] = useState({ top: 0, left: 0 });
  const sortTriggerRef = useRef<View>(null);
  const filtersTriggerRef = useRef<View>(null);
  const { width: windowWidth } = useWindowDimensions();

  const openSortMenu = () => {
    sortTriggerRef.current?.measureInWindow((x, y, width, height) => {
      setSortAnchor({ top: y + height + 4, right: windowWidth - (x + width) });
      setOpenMenu('sort');
    });
  };
  const openFiltersMenu = () => {
    filtersTriggerRef.current?.measureInWindow((x, y, _width, height) => {
      setFiltersAnchor({ top: y + height + 4, left: x });
      setOpenMenu('filters');
    });
  };
  const closeFiltersMenu = () => {
    setOpenMenu(null);
    setFilterMenuView('root');
  };

  const goToRestaurant = (restaurant: MapResultData) => {
    router.push(`/restaurant/${restaurant.id}`);
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
        <Text className="text-center text-sm text-muted">Couldn't load search.</Text>
        <Pressable onPress={() => refetch()} className="rounded-xl bg-ink px-4 py-2.5">
          <Text className="text-sm font-bold text-white">Try again</Text>
        </Pressable>
      </View>
    );
  }

  const sortLabel = SORT_OPTIONS.find((option) => option.key === sortBy)?.label ?? '';

  const filteredResults = results.filter(
    (restaurant) =>
      (!activeFilters.ambient || restaurant.ambient === activeFilters.ambient) &&
      (!deliveryOnly || restaurant.hasDelivery) &&
      activeFeatures.every((key) => FEATURE_OPTIONS.find((option) => option.key === key)?.matches(restaurant)),
  );

  const taxonomyChips = (
    [
      ['cuisine', taxonomies?.cuisines],
      ['occasion', taxonomies?.occasions],
      ['ambient', taxonomies?.ambients],
    ] as const
  ).flatMap(([dimension, options]) => {
    const activeId = activeFilters[dimension];
    const label = options?.find((option) => option.id === activeId)?.label;
    return activeId && label
      ? [{ key: dimension, label, onClear: () => setActiveFilters((current) => ({ ...current, [dimension]: undefined })) }]
      : [];
  });
  const deliveryChips = deliveryOnly
    ? [{ key: 'delivery', label: 'Delivery', onClear: () => setDeliveryOnly(false) }]
    : [];
  const featureChips = activeFeatures.map((key) => {
    const option = FEATURE_OPTIONS.find((candidate) => candidate.key === key);
    return {
      key: `feature-${key}`,
      label: option?.label ?? key,
      onClear: () => setActiveFeatures((current) => current.filter((candidate) => candidate !== key)),
    };
  });
  const filterChips = [...taxonomyChips, ...deliveryChips, ...featureChips];

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
        <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-[#f3f4f6]">
          <Icon spec={{ set: 'Ionicons', name: 'person-outline' }} size={18} color="#1f2937" />
        </Pressable>
      </View>

      <LocationHeader />

      <View className="flex-row items-center justify-between px-4 pb-1 pt-4">
        {isFetching ? (
          <View className="flex-row items-center gap-1.5">
            <ActivityIndicator size="small" />
            <Text className="text-sm text-[#6b7280]">Updating...</Text>
          </View>
        ) : (
          <Text className="text-sm text-[#6b7280]">{filteredResults.length} results</Text>
        )}
        <Pressable ref={sortTriggerRef} onPress={openSortMenu} className="flex-row items-center gap-1">
          <Text className="text-[15px] font-semibold text-[#4f46e5]">Sort: {sortLabel}</Text>
          <Icon spec={{ set: 'Ionicons', name: 'chevron-down' }} size={14} color="#4f46e5" />
        </Pressable>
      </View>

      <View className="mx-4 mt-2 flex-row flex-wrap items-center gap-2">
        <Pressable
          ref={filtersTriggerRef}
          onPress={openFiltersMenu}
          className="flex-row items-center gap-1.5 self-start rounded-full border border-[#e5e7eb] px-3.5 py-2"
        >
          <Icon spec={{ set: 'Ionicons', name: 'options-outline' }} size={14} color="#1f2937" />
          <Text className="text-[15px] font-light text-[#1f2937]">Filters</Text>
          <Icon spec={{ set: 'Ionicons', name: 'chevron-down' }} size={14} color="#1f2937" />
        </Pressable>
        {filterChips.map((chip) => (
          <Pressable
            key={chip.key}
            onPress={chip.onClear}
            className="flex-row items-center gap-1.5 self-start rounded-full bg-[#eef2ff] px-3.5 py-2"
          >
            <Text className="text-[15px] font-light text-[#4338ca]">{chip.label}</Text>
            <Icon spec={{ set: 'Ionicons', name: 'close' }} size={14} color="#4338ca" />
          </Pressable>
        ))}
      </View>

      {filteredResults.length === 0 ? (
        <EmptyState
          icon={{ set: 'Ionicons', name: 'search-outline' }}
          title="No restaurants found"
          subtitle="Try a different search or clear a filter."
        />
      ) : (
        <ScrollView contentContainerStyle={{ gap: 16, padding: 16 }} showsVerticalScrollIndicator={false}>
          {sortResults(filteredResults, sortBy).map((restaurant) => (
            <MapResultCard key={restaurant.id} restaurant={restaurant} onPress={goToRestaurant} />
          ))}
        </ScrollView>
      )}

      <Modal visible={openMenu === 'sort'} transparent animationType="fade" onRequestClose={() => setOpenMenu(null)}>
        <Pressable className="flex-1" onPress={() => setOpenMenu(null)}>
          <View
            className="absolute w-48 rounded-2xl bg-white py-2 shadow-lg"
            style={{ top: sortAnchor.top, right: sortAnchor.right }}
          >
            {SORT_OPTIONS.map((option) => (
              <Pressable
                key={option.key}
                onPress={() => {
                  setSortBy(option.key);
                  setOpenMenu(null);
                }}
                className="px-4 py-2.5"
              >
                <Text
                  className={`text-sm ${option.key === sortBy ? 'font-bold text-[#4f46e5]' : 'text-[#1f2937]'}`}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      <Modal visible={openMenu === 'filters'} transparent animationType="fade" onRequestClose={closeFiltersMenu}>
        <Pressable className="flex-1" onPress={closeFiltersMenu}>
          <View
            className="absolute w-56 rounded-2xl bg-white py-2 shadow-lg"
            style={{ top: filtersAnchor.top, left: filtersAnchor.left }}
          >
            {filterMenuView === 'root' ? (
              FILTER_CATEGORIES.map((category) =>
                category.dimension === 'delivery' ? (
                  <Pressable
                    key={category.label}
                    onPress={() => setDeliveryOnly((current) => !current)}
                    className="flex-row items-center justify-between gap-2.5 px-4 py-2.5"
                  >
                    <View className="flex-row items-center gap-2.5">
                      <Icon spec={category.icon} size={16} color="#1f2937" />
                      <Text className="text-sm text-[#1f2937]">{category.label}</Text>
                    </View>
                    <Icon
                      spec={{ set: 'Ionicons', name: deliveryOnly ? 'checkbox' : 'square-outline' }}
                      size={18}
                      color={deliveryOnly ? '#4f46e5' : '#9ca3af'}
                    />
                  </Pressable>
                ) : (
                  <Pressable
                    key={category.label}
                    onPress={() => setFilterMenuView(category.dimension as FilterMenuView)}
                    className="flex-row items-center gap-2.5 px-4 py-2.5"
                  >
                    <Icon spec={category.icon} size={16} color="#1f2937" />
                    <Text className="text-sm text-[#1f2937]">{category.label}</Text>
                  </Pressable>
                ),
              )
            ) : (
              <>
                <View className="flex-row items-center gap-2 border-b border-[#f3f4f6] px-4 pb-2.5">
                  <Pressable
                    onPress={() => setFilterMenuView('root')}
                    className="h-6 w-6 items-center justify-center"
                  >
                    <Icon spec={{ set: 'Ionicons', name: 'chevron-back' }} size={16} color="#1f2937" />
                  </Pressable>
                  <Text className="text-sm font-bold text-[#1f2937]">{FILTER_MENU_TITLES[filterMenuView]}</Text>
                </View>

                {(filterMenuView === 'cuisine' || filterMenuView === 'occasion' || filterMenuView === 'ambient') &&
                  (
                    { cuisine: taxonomies?.cuisines, occasion: taxonomies?.occasions, ambient: taxonomies?.ambients }[
                      filterMenuView
                    ] ?? []
                  ).map((option) => {
                    const isActive = activeFilters[filterMenuView] === option.id;
                    return (
                      <Pressable
                        key={option.id}
                        onPress={() => {
                          setActiveFilters((current) => ({ ...current, [filterMenuView]: option.id }));
                          setFilterMenuView('root');
                        }}
                        className="flex-row items-center justify-between px-4 py-2.5"
                      >
                        <Text className={`text-sm ${isActive ? 'font-bold text-[#4f46e5]' : 'text-[#1f2937]'}`}>
                          {option.label}
                        </Text>
                        {isActive ? (
                          <Icon spec={{ set: 'Ionicons', name: 'checkmark' }} size={16} color="#4f46e5" />
                        ) : null}
                      </Pressable>
                    );
                  })}

                {filterMenuView === 'features' && (
                  <>
                    {FEATURE_OPTIONS.map((option) => {
                      const isActive = activeFeatures.includes(option.key);
                      return (
                        <Pressable
                          key={option.key}
                          onPress={() =>
                            setActiveFeatures((current) =>
                              current.includes(option.key)
                                ? current.filter((key) => key !== option.key)
                                : [...current, option.key],
                            )
                          }
                          className="flex-row items-center justify-between px-4 py-2.5"
                        >
                          <Text className={`text-sm ${isActive ? 'font-bold text-[#4f46e5]' : 'text-[#1f2937]'}`}>
                            {option.label}
                          </Text>
                          <Icon
                            spec={{ set: 'Ionicons', name: isActive ? 'checkbox' : 'square-outline' }}
                            size={18}
                            color={isActive ? '#4f46e5' : '#9ca3af'}
                          />
                        </Pressable>
                      );
                    })}
                    <Pressable
                      onPress={() => setFilterMenuView('root')}
                      className="mt-1 border-t border-[#f3f4f6] px-4 py-2.5"
                    >
                      <Text className="text-center text-sm font-bold text-[#4f46e5]">Done</Text>
                    </Pressable>
                  </>
                )}
              </>
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
