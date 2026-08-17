import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { z } from 'zod';

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
