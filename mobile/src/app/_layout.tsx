import React from 'react';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
    return (
        <>
            <Stack screenOptions={{ headerShown: false}}>
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(tabs)" />
            </Stack>
            <Toast />
        </>
    );
}