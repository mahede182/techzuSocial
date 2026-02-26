import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';

export const unstable_settings = {
    initialRouteName: '(auth)',
};

export default function RootLayout() {
    const colorScheme = useColorScheme();

    return (
        <>
            {/* <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} /> */}
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(tabs)" />
            </Stack>
            <Toast />
        </>
    );
}