import { useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

import { useDiscoveryTaxonomiesQuery } from '@/features/search/api';
import { CuisineOverviewCard } from '@/features/search/components';
import type { Cuisine } from '@/features/search/types';

export default function CategoryScreen() {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useDiscoveryTaxonomiesQuery();

  const goToCategory = (cuisine: Cuisine) => {
    router.push(`/category/${cuisine.id}`);
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
        <Text className="text-center text-sm text-muted">Não foi possível carregar as categorias.</Text>
        <Pressable onPress={() => refetch()} className="rounded-xl bg-ink px-4 py-2.5">
          <Text className="text-sm font-bold text-white">Tentar de novo</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 24 }}>
      <View className="px-4 pt-4">
        <Text className="text-xl font-bold text-ink">Categorias</Text>
      </View>
      <View className="flex-row flex-wrap justify-between gap-y-4 px-4 pt-3.5">
        {data?.cuisines.map((cuisine) => (
          <CuisineOverviewCard key={cuisine.id} cuisine={cuisine} onPress={goToCategory} />
        ))}
      </View>
    </ScrollView>
  );
}
