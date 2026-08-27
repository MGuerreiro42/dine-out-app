import { useQuery } from '@tanstack/react-query';

import { RestaurantDetailSchema as WireRestaurantDetailSchema, mapSummaryToRestaurant } from '@/lib/api';
import { getPlaceDetails } from '@/mocks/repository';
import { RestaurantDetailSchema } from '@/features/restaurant/types';
import type { RestaurantDetail } from '@/features/restaurant/types';

export function useRestaurantDetailQuery(id: number) {
  return useQuery({
    queryKey: ['restaurant', id],
    queryFn: async () => {
      const data = await getPlaceDetails(String(id));
      if (!data) {
        return null;
      }

      const wire = WireRestaurantDetailSchema.parse(data);
      const base = mapSummaryToRestaurant(wire);

      const detail: RestaurantDetail = {
        ...base,
        photos: wire.photoUrl ? [wire.photoUrl] : [],
        tags: wire.tags,
        category: wire.category,
        addressShort: wire.formattedAddress,
        menu: wire.menuItems,
        thingsToKnow: wire.thingsToKnow,
        phones: wire.phones,
        whatsapp: wire.whatsapp,
        instagramHandle: wire.instagramHandle,
        websites: wire.websites,
        socialLinks: wire.socialLinks,
        categoryAlternates: wire.categoryAlternates,
        brandName: wire.brandName,
        reviews: [],
        highlights: wire.highlights,
      };

      return RestaurantDetailSchema.parse(detail);
    },
  });
}
