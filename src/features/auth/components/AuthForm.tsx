import { useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';

type AuthFormProps = {
  isSignup: boolean;
  onToggleMode: () => void;
  onSubmit: () => void;
};

type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AuthForm({ isSignup, onToggleMode, onSubmit }: AuthFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const title = isSignup ? 'Criar conta' : 'Entrar';
  const subtitle = isSignup
    ? 'Crie sua conta para reservar, favoritar e acompanhar pedidos.'
    : 'Entre para acessar suas reservas, pedidos e favoritos.';
  const switchText = isSignup ? 'Já tem conta?' : 'Ainda não tem conta?';
  const switchAction = isSignup ? 'Entrar' : 'Criar conta';

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
    const nextErrors: FormErrors = {};

    if (isSignup && name.trim().length === 0) {
      nextErrors.name = 'Informe seu nome completo.';
    }

    if (email.length === 0) {
      nextErrors.email = 'Informe seu e-mail.';
    } else if (!EMAIL_REGEX.test(email)) {
      nextErrors.email = 'E-mail inválido.';
    }

    if (password.length === 0) {
      nextErrors.password = 'Informe sua senha.';
    } else if (password.length < 6) {
      nextErrors.password = 'A senha deve ter pelo menos 6 caracteres.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit();
  };

  return (
    <View className="px-7 pb-7 pt-5">
      <View className="mb-[18px] h-1.5 w-11 rounded-full bg-accent" />
      <Text className="mb-1.5 text-2xl font-bold text-ink">{title}</Text>
      <Text className="mb-6 text-[15px] text-muted">{subtitle}</Text>

      <View className="gap-3">
        {isSignup ? (
          <View>
            <TextInput
              placeholder="Nome completo"
              value={name}
              onChangeText={handleNameChange}
              className={`rounded-xl border px-4 py-3.5 text-sm ${errors.name ? 'border-[#b23b3b]' : 'border-sand'}`}
            />
            {errors.name ? <Text className="mt-1 text-xs text-[#b23b3b]">{errors.name}</Text> : null}
          </View>
        ) : null}
        <View>
          <TextInput
            placeholder="E-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={handleEmailChange}
            className={`rounded-xl border px-4 py-3.5 text-sm ${errors.email ? 'border-[#b23b3b]' : 'border-sand'}`}
          />
          {errors.email ? <Text className="mt-1 text-xs text-[#b23b3b]">{errors.email}</Text> : null}
        </View>
        <View>
          <TextInput
            placeholder="Senha"
            secureTextEntry
            value={password}
            onChangeText={handlePasswordChange}
            className={`rounded-xl border px-4 py-3.5 text-sm ${errors.password ? 'border-[#b23b3b]' : 'border-sand'}`}
          />
          {errors.password ? <Text className="mt-1 text-xs text-[#b23b3b]">{errors.password}</Text> : null}
        </View>
      </View>

      {isSignup ? null : (
        <Pressable onPress={() => Alert.alert('Simulação', 'Recuperar senha')} className="pt-2.5">
          <Text className="text-xs font-bold text-ink underline">Esqueceu a senha?</Text>
        </Pressable>
      )}

      <Pressable onPress={handleSubmit} className="mt-5 items-center rounded-xl bg-ink py-3.5">
        <Text className="text-sm font-bold text-white">{title}</Text>
      </Pressable>

      <View className="my-[22px] flex-row items-center gap-2.5">
        <View className="h-px flex-1 bg-gray-100" />
        <Text className="text-[13px] text-muted">ou continue com</Text>
        <View className="h-px flex-1 bg-gray-100" />
      </View>

      <View className="flex-row gap-2.5">
        <Pressable
          onPress={() => Alert.alert('Simulação', 'Login com Google')}
          className="flex-1 items-center rounded-xl border border-sand py-3"
        >
          <Text className="text-[15px] font-bold text-ink">Google</Text>
        </Pressable>
        <Pressable
          onPress={() => Alert.alert('Simulação', 'Login com Apple')}
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
