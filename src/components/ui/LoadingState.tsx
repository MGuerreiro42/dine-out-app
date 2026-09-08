import { ActivityIndicator, Text, View } from 'react-native';

type LoadingStateProps = {
  message?: string;
};

export function LoadingState({ message }: LoadingStateProps) {
  return (
    <View className="flex-1 items-center justify-center gap-sm bg-white px-xl">
      <ActivityIndicator />
      {message ? <Text className="text-center text-sm text-muted">{message}</Text> : null}
    </View>
  );
}
