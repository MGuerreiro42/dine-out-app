import { BottomSheet } from '@/components/ui';
import type { LinkOption } from '@/features/restaurant/lib/externalLinks';

import { RedirectOptionsSheetContent } from './RedirectOptionsSheetContent';

type LinkChooserSheetProps = {
  title: string;
  options: LinkOption[] | null;
  onClose: () => void;
};

export function LinkChooserSheet({ title, options, onClose }: LinkChooserSheetProps) {
  return (
    <BottomSheet visible={options !== null} onClose={onClose}>
      <RedirectOptionsSheetContent title={title} options={options ?? []} onOpened={onClose} />
    </BottomSheet>
  );
}
