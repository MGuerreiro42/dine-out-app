import { Pressable, Text, View } from 'react-native';

type ErrorStateProps = {
  message: string;
  onRetry: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View className="flex-1 items-center justify-center gap-sm2 bg-white px-xl">
      <Text className="text-center text-sm text-muted">{message}</Text>
      <Pressable onPress={onRetry} className="rounded-lg bg-ink px-md py-sm2">
        <Text className="text-sm font-bold text-white">Try again</Text>
      </Pressable>
    </View>
  );
}
