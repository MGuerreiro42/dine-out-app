import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { z } from 'zod';

// Strict TS union (not derived from the Zod schema below) so authoring icon
// data at its source — mocks, taxonomy tables — gets a compile-time check
// against each set's real glyph names. The Zod schema is intentionally
// looser (shape-only, like this project's other free-form string fields);
// exhaustive glyph validation isn't practical at runtime and isn't the point
// of that schema — the mock-authoring type above is the real safety net.
export type IconSpec =
  | { set: 'Ionicons'; name: keyof typeof Ionicons.glyphMap }
  | { set: 'MaterialCommunityIcons'; name: keyof typeof MaterialCommunityIcons.glyphMap }
  | { set: 'MaterialIcons'; name: keyof typeof MaterialIcons.glyphMap };

export const IconSpecSchema = z.object({
  set: z.enum(['Ionicons', 'MaterialCommunityIcons', 'MaterialIcons']),
  name: z.string(),
}) as z.ZodType<IconSpec>;

type IconProps = {
  spec: IconSpec;
  size?: number;
  color?: string;
};

// Resolves the icon set (Ionicons covers most general UI; MaterialCommunityIcons/
// MaterialIcons fill specific gaps Ionicons lacks — food/amenity glyphs, etc.) so
// every consumer renders one <Icon> instead of repeating this switch.
export function Icon({ spec, size = 20, color = '#161311' }: IconProps) {
  switch (spec.set) {
    case 'Ionicons':
      return <Ionicons name={spec.name} size={size} color={color} />;
    case 'MaterialCommunityIcons':
      return <MaterialCommunityIcons name={spec.name} size={size} color={color} />;
    case 'MaterialIcons':
      return <MaterialIcons name={spec.name} size={size} color={color} />;
  }
}
