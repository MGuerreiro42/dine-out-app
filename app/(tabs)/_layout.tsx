import { Tabs } from 'expo-router';
import { Text } from 'react-native';

const TAB_ICONS = {
  index: '🏠',
  search: '🔍',
  category: '🗂️',
  profile: '👤',
} as const;

function TabIcon({ name }: { name: keyof typeof TAB_ICONS }) {
  return <Text style={{ fontSize: 20 }}>{TAB_ICONS[name]}</Text>;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#161311',
        tabBarInactiveTintColor: '#8a8580',
        tabBarStyle: { borderTopColor: '#eee' },
        tabBarLabelStyle: { fontSize: 10, fontWeight: 'bold' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Home', tabBarIcon: () => <TabIcon name="index" /> }}
      />
      <Tabs.Screen
        name="search"
        options={{ title: 'Buscar', tabBarIcon: () => <TabIcon name="search" /> }}
      />
      <Tabs.Screen
        name="category"
        options={{ title: 'Categorias', tabBarIcon: () => <TabIcon name="category" /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Perfil', tabBarIcon: () => <TabIcon name="profile" /> }}
      />
    </Tabs>
  );
}
