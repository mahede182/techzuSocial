import React from 'react';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          position: 'absolute',
          bottom: 30,
          left: 20,
          right: 20,
          height: 70,
          borderRadius: 35,
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.05,
          shadowRadius: 15,
          elevation: 5,
        },
        tabBarItemStyle: {
          padding: 8,
        },
      }}>
      <Tabs.Screen 
        name="index" 
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'home' : 'home-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen 
        name="create" 
        options={{
          tabBarIcon: ({ color }) => (
            <View style={{
              width: 60,
              height: 60,
              borderRadius: 20,
              backgroundColor: '#007AFF',
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#007AFF',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.4,
              shadowRadius: 10,
              elevation: 8,
            }}>
              <Ionicons name="add" size={32} color="#fff" />
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
              size={24} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
