import { useRef, useState } from 'react';
import { type View, useWindowDimensions } from 'react-native';

type AnchoredMenuAlign = 'start' | 'end';

type MenuAnchor = { top: number; left?: number; right?: number };

export function useAnchoredMenu(align: AnchoredMenuAlign = 'start') {
  const [visible, setVisible] = useState(false);
  const [anchor, setAnchor] = useState<MenuAnchor>({ top: 0 });
  const triggerRef = useRef<View>(null);
  const { width: windowWidth } = useWindowDimensions();

  const open = () => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      const top = y + height + 4;
      setAnchor(
        align === 'end'
          ? { top, right: windowWidth - (x + width) }
          : { top, left: Math.min(x, windowWidth - width) },
      );
      setVisible(true);
    });
  };
  const close = () => setVisible(false);

  return { triggerRef, anchor, visible, open, close };
}
