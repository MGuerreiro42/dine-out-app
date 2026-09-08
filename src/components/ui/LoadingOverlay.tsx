import { ActivityIndicator, Modal, Text, View } from "react-native";

import { colors } from "@/theme";

type LoadingOverlayProps = {
  visible: boolean;
  label: string;
};

// Blocking progress feedback for a mutation in flight — deliberately no
// dismiss affordance (not even the hardware back button, via the no-op
// onRequestClose Android requires) since it just reflects a request already
// underway, not a choice the user can cancel out of here.
export function LoadingOverlay({ visible, label }: LoadingOverlayProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => {}}>
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="items-center gap-sm2 rounded-2xl bg-white px-lg py-md2">
          <ActivityIndicator color={colors.accent} />
          <Text className="text-sm font-bold text-ink">{label}</Text>
        </View>
      </View>
    </Modal>
  );
}
