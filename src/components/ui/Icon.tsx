import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { z } from 'zod';

import { colors, iconSize } from '@/theme';

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
