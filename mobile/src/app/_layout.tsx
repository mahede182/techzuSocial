import React, { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { Colors } from '@/constants/colors';
import { useAppStore } from '@/store/store';
import { getToken } from '@/api/client';

export const unstable_settings = {
    initialRouteName: '(auth)',
};

export default function RootLayout() {
    const router = useRouter();
    const segments = useSegments();
    const [initializing, setInitializing] = useState(true);
    const token = useAppStore((state) => state.token);

    useEffect(() => {
        const hydrateAuth = async () => {
            try {
                const storedToken = await getToken();
                if (storedToken) {
                    useAppStore.setState({ token: storedToken });
                }
            } finally {
                setInitializing(false);
            }
        };

        hydrateAuth();
    }, []);

    useEffect(() => {
        if (initializing) return;

        const inAuthGroup = segments[0] === '(auth)';

        if (!token && !inAuthGroup) {
            router.replace('/(auth)/login');
        } else if (token && inAuthGroup) {
            router.replace('/(tabs)');
        }
    }, [initializing, segments, token, router]);

    if (initializing) {
        return (
            <>
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: Colors.background,
                    }}
                >
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
                <Toast />
            </>
        );
    }

    return (
        <>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(tabs)" />
            </Stack>
            <Toast />
        </>
    );
}