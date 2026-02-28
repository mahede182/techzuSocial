import React from 'react';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

const _WIDTH = 60;
const _HEIGHT = 60;
const _RADIUS = 20;

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          position: 'absolute',
          bottom: 60,
          height: 80,
          marginHorizontal: '10%',
          borderRadius: 30,
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.05,
          shadowRadius: 15,
          elevation: 5,
        },
        tabBarItemStyle: {
          padding: 10,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={36}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              width: _WIDTH,
              height: _HEIGHT,
              borderRadius: _RADIUS,
              backgroundColor: focused ? Colors.primary : Colors.background,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: Colors.primary,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.4,
              shadowRadius: 10,
              elevation: 8,
            }}>
              <Ionicons name="add" size={48} color={focused ? Colors.background : Colors.primary} />
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={36}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
