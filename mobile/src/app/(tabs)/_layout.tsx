import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { useColorScheme, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TAB_ICONS = {
  index: 'home',
  create: 'add',
  profile: 'person',
};

function CustomTab({ state, navigation }: any) {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const onPress = async (route: any) => {
    if (route.name === 'create') {
      // Navigate to create screen
      router.push('/(tabs)/create');
      return;
    }

    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    const isFocused = state.index === state.routes.indexOf(route);
    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  return (
    <View style={styles.tabContainer}>
      <View style={[styles.tabBar, { backgroundColor: '#fff' }]}>
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          const isMiddle = route.name === 'create';
          const iconName = TAB_ICONS[route.name as keyof typeof TAB_ICONS];

          if (isMiddle) {
            return (
              <TouchableOpacity
                key={route.key}
                style={styles.fabContainer}
                onPress={() => onPress(route)}
                activeOpacity={0.8}
              >
                <View style={[styles.fab, { backgroundColor: '#007AFF' }]}>
                  <Ionicons name="add" size={32} color="#fff" />
                </View>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => onPress(route)}
              style={styles.tabItem}
            >
              <Ionicons
                name={isFocused ? iconName : `${iconName}-outline` as any}
                size={24}
                color={isFocused ? '#007AFF' : '#8E8E93'}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTab {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="create" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '90%',
    height: 70,
    borderRadius: 35,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
  },
  tabItem: {
    padding: 8,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabContainer: {
    top: -25,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    flex: 1,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
});
