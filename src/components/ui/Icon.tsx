import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import { colors, iconSize } from '@/theme';

export type IconSpec =
  | { set: 'Ionicons'; name: keyof typeof Ionicons.glyphMap }
  | { set: 'MaterialCommunityIcons'; name: keyof typeof MaterialCommunityIcons.glyphMap }
  | { set: 'MaterialIcons'; name: keyof typeof MaterialIcons.glyphMap };

const GLYPH_MAPS: Record<IconSpec['set'], object> = {
  Ionicons: Ionicons.glyphMap,
  MaterialCommunityIcons: MaterialCommunityIcons.glyphMap,
  MaterialIcons: MaterialIcons.glyphMap,
};

export function toIconSpec(icon: { set: IconSpec['set']; name: string }, fallback: IconSpec): IconSpec {
  return icon.name in GLYPH_MAPS[icon.set] ? (icon as IconSpec) : fallback;
}

type IconProps = {
  spec: IconSpec;
  size?: number;
  color?: string;
};

export function Icon({ spec, size = iconSize.ui, color = colors.ink }: IconProps) {
  switch (spec.set) {
    case 'Ionicons':
      return <Ionicons name={spec.name} size={size} color={color} />;
    case 'MaterialCommunityIcons':
      return <MaterialCommunityIcons name={spec.name} size={size} color={color} />;
    case 'MaterialIcons':
      return <MaterialIcons name={spec.name} size={size} color={color} />;
  }
}
