import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';

import { Icon, type IconSpec } from '@/components/ui';
import { colors } from '@/theme';

const TAB_ICONS: Record<string, IconSpec> = {
  index: { set: 'Ionicons', name: 'home-outline' },
  search: { set: 'Ionicons', name: 'search-outline' },
  category: { set: 'Ionicons', name: 'grid-outline' },
  profile: { set: 'Ionicons', name: 'person-outline' },
};

function TabIcon({ name, color }: { name: keyof typeof TAB_ICONS; color: ColorValue }) {
  return <Icon spec={TAB_ICONS[name]} color={color as string} />;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.inkFaint,
        tabBarStyle: { borderTopColor: colors.sandBorder },
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
