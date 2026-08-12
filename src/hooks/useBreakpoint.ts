import { useWindowDimensions } from 'react-native';

export type Breakpoint = 'phone' | 'tablet';

// Matches Tailwind/NativeWind's `md:` breakpoint (768px) so JS-driven layout
// switches (e.g. HorizontalRail's scroll-vs-wrap behavior) line up with the
// plain className breakpoints used elsewhere for percentage-width grids.
const TABLET_MIN_WIDTH = 768;

export function useBreakpoint(): Breakpoint {
  const { width } = useWindowDimensions();
  return width >= TABLET_MIN_WIDTH ? 'tablet' : 'phone';
}
