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
        photos: [],
        tags: wire.tags,
        addressShort: wire.formattedAddress,
        menu: wire.menuItems,
        thingsToKnow: wire.thingsToKnow,
        phone: wire.phones[0] ?? null,
        whatsapp: wire.whatsapp,
        instagramHandle: wire.instagramHandle,
        reviews: [],
        highlights: wire.highlights,
      };

      return RestaurantDetailSchema.parse(detail);
    },
  });
}
