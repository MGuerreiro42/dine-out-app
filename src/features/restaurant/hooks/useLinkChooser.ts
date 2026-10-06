import { useEffect, useRef, useState } from 'react';

import { type LinkOption, openExternalUrl } from '@/features/restaurant/lib/externalLinks';

export function useLinkChooser() {
  const [options, setOptions] = useState<LinkOption[] | null>(null);
  const pending = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const choose = async (load: () => LinkOption[] | Promise<LinkOption[]>) => {
    if (pending.current) {
      return;
    }
    pending.current = true;
    try {
      const loaded = await load();
      const [only] = loaded;
      if (!mounted.current || !only) {
        return;
      }
      if (loaded.length === 1) {
        await openExternalUrl(only.url);
      } else {
        setOptions(loaded);
      }
    } finally {
      pending.current = false;
    }
  };

  return { options, choose, close: () => setOptions(null) };
}
