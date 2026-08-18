import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';

import { Icon, type IconSpec } from '@/components/ui';

const TAB_ICONS: Record<string, IconSpec> = {
  index: { set: 'Ionicons', name: 'home-outline' },
  search: { set: 'Ionicons', name: 'search-outline' },
  category: { set: 'Ionicons', name: 'grid-outline' },
  profile: { set: 'Ionicons', name: 'person-outline' },
};

function TabIcon({ name, color }: { name: keyof typeof TAB_ICONS; color: ColorValue }) {
  return <Icon spec={TAB_ICONS[name]} size={20} color={color as string} />;
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
        options={{ title: 'Home', tabBarIcon: ({ color }) => <TabIcon name="index" color={color} /> }}
      />
      <Tabs.Screen
        name="search"
        options={{ title: 'Search', tabBarIcon: ({ color }) => <TabIcon name="search" color={color} /> }}
      />
      <Tabs.Screen
        name="category"
        options={{
          title: 'Categories',
          href: null,
          tabBarIcon: ({ color }) => <TabIcon name="category" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarIcon: ({ color }) => <TabIcon name="profile" color={color} /> }}
      />
    </Tabs>
  );
}
