// Mirrors dine-out-backend's taxonomies.data.ts humanizeCategory() 1:1 — same
// "mirrored, not shared" discipline as this file's own category-subtype data (no
// cross-repo import). Used to match a raw restaurant.category value back to a
// DiscoveryTaxonomies.categorySubtypes label, which the wire schema only carries as
// this same humanized string, not a machine key.
export function humanizeCategory(category: string): string {
  return category
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
