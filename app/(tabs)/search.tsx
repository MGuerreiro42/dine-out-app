import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';

import { Icon, type IconSpec } from '@/components/ui';
import { useDiscoveryTaxonomiesQuery } from '@/features/search/api';
import { LocationHeader, MapResultCard } from '@/features/search/components';
import { useDebouncedValue, useSearchMapDiscovery } from '@/features/search/hooks';
import type { MapResultData } from '@/features/search/hooks';

type TaxonomyDimension = 'cuisine' | 'occasion' | 'ambient';
type ActiveFilters = Partial<Record<TaxonomyDimension, string>>;

type SortKey = 'top_rated' | 'trending' | 'price_asc' | 'price_desc';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'top_rated', label: 'Top Rated' },
  { key: 'trending', label: 'Trending' },
  { key: 'price_asc', label: 'Price: Low to High' },
  { key: 'price_desc', label: 'Price: High to Low' },
];

const FILTER_CATEGORIES: { icon: IconSpec; label: string }[] = [
  { icon: { set: 'Ionicons', name: 'restaurant-outline' }, label: 'Cuisine' },
  { icon: { set: 'Ionicons', name: 'wine-outline' }, label: 'Ambient' },
  { icon: { set: 'Ionicons', name: 'sparkles-outline' }, label: 'Occasion' },
  { icon: { set: 'Ionicons', name: 'star-outline' }, label: 'Features' },
  { icon: { set: 'Ionicons', name: 'cash-outline' }, label: 'Price' },
  { icon: { set: 'MaterialCommunityIcons', name: 'moped-outline' }, label: 'Delivery' },
];

const sortResults = (results: MapResultData[], sortBy: SortKey) =>
  [...results].sort((a, b) => {
    switch (sortBy) {
      case 'top_rated':
        return Number(b.rating) - Number(a.rating);
      case 'trending':
        return a.id - b.id;
      case 'price_asc':
        return a.priceLevel.length - b.priceLevel.length;
      case 'price_desc':
        return b.priceLevel.length - a.priceLevel.length;
      default:
        return 0;
    }
  });

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ cuisine?: string; occasion?: string; ambient?: string; delivery?: string }>();
  const [searchText, setSearchText] = useState('');
  const debouncedSearchText = useDebouncedValue(searchText);
  const { isLoading, isError, refetch, results } = useSearchMapDiscovery(debouncedSearchText);
  const { data: taxonomies } = useDiscoveryTaxonomiesQuery();
  // Seeded once from the incoming route params (e.g. TypeDetailScreen's "View
  // all" links); chips can then be dismissed independently without the URL
  // fighting back on every render.
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    cuisine: params.cuisine,
    occasion: params.occasion,
    ambient: params.ambient,
  });
  const [deliveryOnly, setDeliveryOnly] = useState(params.delivery === '1');
  const [sortBy, setSortBy] = useState<SortKey>('top_rated');
  const [openMenu, setOpenMenu] = useState<'sort' | 'filters' | null>(null);
  const [sortAnchor, setSortAnchor] = useState({ top: 0, right: 0 });
  const [filtersAnchor, setFiltersAnchor] = useState({ top: 0, left: 0 });
  const sortTriggerRef = useRef<View>(null);
  const filtersTriggerRef = useRef<View>(null);
  const { width: windowWidth } = useWindowDimensions();

  // Measures the trigger's real on-screen position instead of guessing fixed
  // pixel offsets — keeps the dropdown anchored correctly on any device.
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
      (!activeFilters.cuisine || restaurant.cuisine === activeFilters.cuisine) &&
      (!activeFilters.occasion || restaurant.occasion === activeFilters.occasion) &&
      (!activeFilters.ambient || restaurant.ambient === activeFilters.ambient) &&
      (!deliveryOnly || restaurant.hasDelivery),
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
  const filterChips = deliveryOnly
    ? [...taxonomyChips, { key: 'delivery', label: 'Delivery', onClear: () => setDeliveryOnly(false) }]
    : taxonomyChips;

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
        <Text className="text-sm text-[#6b7280]">{filteredResults.length} results</Text>
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

      <ScrollView contentContainerStyle={{ gap: 16, padding: 16 }} showsVerticalScrollIndicator={false}>
        {sortResults(filteredResults, sortBy).map((restaurant) => (
          <MapResultCard key={restaurant.id} restaurant={restaurant} onPress={goToRestaurant} />
        ))}
      </ScrollView>

      {/* Map view paused — filtering-only for now, see MapResultsSheet/SearchMapView. */}

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

      <Modal
        visible={openMenu === 'filters'}
        transparent
        animationType="fade"
        onRequestClose={() => setOpenMenu(null)}
      >
        <Pressable className="flex-1" onPress={() => setOpenMenu(null)}>
          <View
            className="absolute w-44 rounded-2xl bg-white py-2 shadow-lg"
            style={{ top: filtersAnchor.top, left: filtersAnchor.left }}
          >
            {FILTER_CATEGORIES.map((category) => (
              <Pressable
                key={category.label}
                onPress={() => {
                  setOpenMenu(null);
                  Alert.alert(category.label, 'Coming soon.');
                }}
                className="flex-row items-center gap-2.5 px-4 py-2.5"
              >
                <Icon spec={category.icon} size={16} color="#1f2937" />
                <Text className="text-sm text-[#1f2937]">{category.label}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
