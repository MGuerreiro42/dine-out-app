import { useWindowDimensions } from 'react-native';

export type Breakpoint = 'phone' | 'tablet';

const TABLET_MIN_WIDTH = 768;

export function useBreakpoint(): Breakpoint {
  const { width } = useWindowDimensions();
  return width >= TABLET_MIN_WIDTH ? 'tablet' : 'phone';
}
