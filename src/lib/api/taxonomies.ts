import { apiGet } from '@/lib/apiClient';
import type { DiscoveryTaxonomies } from '@/lib/api/schema';

export async function getDiscoveryTaxonomies(): Promise<DiscoveryTaxonomies> {
  return apiGet<DiscoveryTaxonomies>('/taxonomies');
}
