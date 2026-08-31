import type { ReactNode } from 'react';
import { Modal, Pressable, View } from 'react-native';

type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function BottomSheet({ visible, onClose, children }: BottomSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable onPress={onClose} className="flex-1 justify-end bg-black/50">
        <Pressable onPress={(e) => e.stopPropagation()} className="rounded-t-3xl bg-white p-md2 pb-xl">
          <View className="mx-auto mb-md h-1 w-9 rounded-full bg-sand-border" />
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
