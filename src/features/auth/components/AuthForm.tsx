import { useEffect, useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';

import { Icon } from '@/components/ui';
import { colors, iconSize } from '@/theme';

type SubmitError = { field: 'email' | 'password'; message: string };

type AuthFormProps = {
  isSignup: boolean;
  onToggleMode: () => void;
  onSubmit: (values: { name?: string; email: string; password: string }) => void;
  submitError?: SubmitError | null;
  isSubmitting?: boolean;
};

type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AuthForm({ isSignup, onToggleMode, onSubmit, submitError, isSubmitting }: AuthFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (submitError) {
      setErrors((prev) => ({ ...prev, [submitError.field]: submitError.message }));
    }
  }, [submitError]);

  const title = isSignup ? 'Create account' : 'Log in';
  const subtitle = isSignup
    ? 'Create your account to book, favorite and track orders.'
    : 'Log in to access your reservations, orders and favorites.';
  const switchText = isSignup ? 'Already have an account?' : "Don't have an account yet?";
  const switchAction = isSignup ? 'Log in' : 'Create account';

  const handleNameChange = (value: string) => {
    setName(value);
    setErrors((prev) => ({ ...prev, name: undefined }));
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setErrors((prev) => ({ ...prev, email: undefined }));
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setErrors((prev) => ({ ...prev, password: undefined }));
  };

  const handleSubmit = () => {
    if (isSubmitting) {
      return;
    }

    const nextErrors: FormErrors = {};

    if (isSignup && name.trim().length === 0) {
      nextErrors.name = 'Enter your full name.';
    }

    if (email.length === 0) {
      nextErrors.email = 'Enter your email.';
    } else if (!EMAIL_REGEX.test(email)) {
      nextErrors.email = 'Invalid email.';
    }

    if (password.length === 0) {
      nextErrors.password = 'Enter your password.';
    } else if (password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({ name: isSignup ? name.trim() : undefined, email, password });
  };

  return (
    <View className="px-xl pb-xl pt-md2">
      <View className="mb-md2 h-1.5 w-11 rounded-full bg-accent" />
      <Text className="mb-sm text-2xl font-bold text-ink">{title}</Text>
      <Text className="mb-lg text-body text-muted">{subtitle}</Text>

      <View className="gap-sm2">
        {isSignup ? (
          <View>
            <Text className="mb-xs text-xs font-bold text-ink">Full name</Text>
            <TextInput
              placeholder="Full name"
              placeholderTextColor={colors.inkFaint}
              value={name}
              onChangeText={handleNameChange}
              className={`rounded-sm border px-md py-md text-sm text-ink ${errors.name ? 'border-danger bg-danger-tint' : 'border-sand-border bg-sand'}`}
            />
            {errors.name ? <Text className="mt-xs text-xs text-danger">{errors.name}</Text> : null}
          </View>
        ) : null}
        <View>
          <Text className="mb-xs text-xs font-bold text-ink">Email</Text>
          <TextInput
            placeholder="Email"
            placeholderTextColor={colors.inkFaint}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={handleEmailChange}
            className={`rounded-sm border px-md py-md text-sm text-ink ${errors.email ? 'border-danger bg-danger-tint' : 'border-sand-border bg-sand'}`}
          />
          {errors.email ? <Text className="mt-xs text-xs text-danger">{errors.email}</Text> : null}
        </View>
        <View>
          <Text className="mb-xs text-xs font-bold text-ink">Password</Text>
          <TextInput
            placeholder="Password"
            placeholderTextColor={colors.inkFaint}
            secureTextEntry
            value={password}
            onChangeText={handlePasswordChange}
            className={`rounded-sm border px-md py-md text-sm text-ink ${errors.password ? 'border-danger bg-danger-tint' : 'border-sand-border bg-sand'}`}
          />
          {errors.password ? <Text className="mt-xs text-xs text-danger">{errors.password}</Text> : null}
        </View>
      </View>

      {isSignup ? null : (
        <Pressable onPress={() => Alert.alert('Demo', 'Reset password')} className="pt-sm2">
          <Text className="text-xs font-bold text-ink underline">Forgot your password?</Text>
        </Pressable>
      )}

      <Pressable
        onPress={handleSubmit}
        disabled={isSubmitting}
        className={`mt-md2 items-center rounded-lg bg-ink py-md ${isSubmitting ? 'opacity-60' : ''}`}
      >
        <Text className="text-sm font-bold text-white">{title}</Text>
      </Pressable>

      <View className="my-lg flex-row items-center gap-sm2">
        <View className="h-px flex-1 bg-sand-border" />
        <Text className="text-caption text-muted">or continue with</Text>
        <View className="h-px flex-1 bg-sand-border" />
      </View>

      <View className="flex-row gap-sm2">
        <Pressable
          onPress={() => Alert.alert('Demo', 'Log in with Google')}
          className="flex-1 flex-row items-center justify-center gap-sm rounded-lg border border-sand-border py-sm2"
        >
          <Icon spec={{ set: 'Ionicons', name: 'logo-google' }} size={iconSize.inline} color={colors.ink} />
          <Text className="text-body font-bold text-ink">Google</Text>
        </Pressable>
        <Pressable
          onPress={() => Alert.alert('Demo', 'Log in with Apple')}
          className="flex-1 flex-row items-center justify-center gap-sm rounded-lg border border-sand-border py-sm2"
        >
          <Icon spec={{ set: 'Ionicons', name: 'logo-apple' }} size={iconSize.inline} color={colors.ink} />
          <Text className="text-body font-bold text-ink">Apple</Text>
        </Pressable>
      </View>

      <Pressable onPress={onToggleMode} className="pt-lg">
        <Text className="text-center text-body text-ink">
          {switchText} <Text className="font-bold underline">{switchAction}</Text>
        </Text>
      </Pressable>
    </View>
  );
}
