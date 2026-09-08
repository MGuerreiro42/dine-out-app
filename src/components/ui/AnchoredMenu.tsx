import type { ReactNode } from 'react';
import { Modal, Pressable, View } from 'react-native';

type AnchoredMenuProps = {
  visible: boolean;
  onClose: () => void;
  anchor: { top: number; left?: number; right?: number };
  width?: string;
  children: ReactNode;
};

export function AnchoredMenu({ visible, onClose, anchor, width = 'w-48', children }: AnchoredMenuProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1" onPress={onClose}>
        <View
          className={`absolute ${width} rounded-2xl bg-white py-sm shadow-lg`}
          style={{ top: anchor.top, left: anchor.left, right: anchor.right }}
        >
          {children}
        </View>
      </Pressable>
    </Modal>
  );
}
