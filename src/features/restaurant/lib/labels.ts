import type { IconSpec } from '@/components/ui';

export function humanizeCategory(category: string): string {
  return category
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getHostname(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

const SOCIAL_LABELS: Record<string, string> = {
  'facebook.com': 'Facebook',
  'instagram.com': 'Instagram',
};

const SOCIAL_ICONS: Record<string, IconSpec> = {
  'facebook.com': { set: 'Ionicons', name: 'logo-facebook' },
  'instagram.com': { set: 'Ionicons', name: 'logo-instagram' },
};

export function getSocialLinkLabel(url: string): string {
  const hostname = getHostname(url);
  if (!hostname) {
    return 'Website';
  }
  return SOCIAL_LABELS[hostname] ?? hostname;
}

export function getSocialLinkIcon(url: string): IconSpec {
  const hostname = getHostname(url);
  return (hostname && SOCIAL_ICONS[hostname]) || { set: 'Ionicons', name: 'share-social-outline' };
}

export function getWebsiteLabel(url: string): string {
  return getHostname(url) ?? url;
}
