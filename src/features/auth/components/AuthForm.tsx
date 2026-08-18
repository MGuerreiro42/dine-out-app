import { Alert, Pressable, Text, TextInput, View } from 'react-native';

type AuthFormProps = {
  isSignup: boolean;
  onToggleMode: () => void;
  onSubmit: () => void;
};

export function AuthForm({ isSignup, onToggleMode, onSubmit }: AuthFormProps) {
  const title = isSignup ? 'Create account' : 'Log in';
  const subtitle = isSignup
    ? 'Create your account to book, favorite and track orders.'
    : 'Log in to access your reservations, orders and favorites.';
  const switchText = isSignup ? 'Already have an account?' : "Don't have an account yet?";
  const switchAction = isSignup ? 'Log in' : 'Create account';

  return (
    <View className="px-7 pb-7 pt-5">
      <View className="mb-[18px] h-1.5 w-11 rounded-full bg-accent" />
      <Text className="mb-1.5 text-2xl font-bold text-ink">{title}</Text>
      <Text className="mb-6 text-[15px] text-muted">{subtitle}</Text>

      <View className="gap-3">
        {isSignup ? (
          <TextInput
            placeholder="Full name"
            className="rounded-xl border border-sand px-4 py-3.5 text-sm"
          />
        ) : null}
        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          className="rounded-xl border border-sand px-4 py-3.5 text-sm"
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          className="rounded-xl border border-sand px-4 py-3.5 text-sm"
        />
      </View>

      {isSignup ? null : (
        <Pressable onPress={() => Alert.alert('Demo', 'Reset password')} className="pt-2.5">
          <Text className="text-xs font-bold text-ink underline">Forgot your password?</Text>
        </Pressable>
      )}

      <Pressable onPress={onSubmit} className="mt-5 items-center rounded-xl bg-ink py-3.5">
        <Text className="text-sm font-bold text-white">{title}</Text>
      </Pressable>

      <View className="my-[22px] flex-row items-center gap-2.5">
        <View className="h-px flex-1 bg-gray-100" />
        <Text className="text-[13px] text-muted">or continue with</Text>
        <View className="h-px flex-1 bg-gray-100" />
      </View>

      <View className="flex-row gap-2.5">
        <Pressable
          onPress={() => Alert.alert('Demo', 'Log in with Google')}
          className="flex-1 items-center rounded-xl border border-sand py-3"
        >
          <Text className="text-[15px] font-bold text-ink">Google</Text>
        </Pressable>
        <Pressable
          onPress={() => Alert.alert('Demo', 'Log in with Apple')}
          className="flex-1 items-center rounded-xl border border-sand py-3"
        >
          <Text className="text-[15px] font-bold text-ink">Apple</Text>
        </Pressable>
      </View>

      <Pressable onPress={onToggleMode} className="pt-[22px]">
        <Text className="text-center text-[15px] text-[#3a3530]">
          {switchText} <Text className="font-bold underline">{switchAction}</Text>
        </Text>
      </Pressable>
    </View>
  );
}
