import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNotifications, type NotificationData } from '@/hooks/useNotifications';
import { useAppStore } from '@/store/store';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import { registerPushToken } from '@/utils/push';

export default function RootLayout() {
    const router = useRouter();
    const { setupHandlers, checkInitialNotification } = useNotifications();
    const { token, isPersist, restoreSession, setFcmToken } = useAppStore();

    useEffect(() => {
        restoreSession();
    }, []);

    useEffect(() => {
        if (!isPersist) return;
        if (token) {
            router.replace('/(tabs)');
        } else {
            router.replace('/(auth)');
        }
    }, [isPersist, token]);

    useEffect(() => {
        if (!isPersist || !token) return;
        registerPushToken().then((fcmToken) => {
            if (fcmToken) setFcmToken(fcmToken);
        });
    }, [isPersist, token]);

    useEffect(() => {
        const handleTap = (data: NotificationData) => {
            if (data?.postId) {
                router.push('/');
            }
        };
        const unsubscribe = setupHandlers(handleTap);
        checkInitialNotification(handleTap);
        return unsubscribe;
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            {!isPersist ? (
                <AppActivityIndicator />
            ) : (
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(auth)" />
                    <Stack.Screen name="(tabs)" />
                </Stack>
            )}
            <Toast />
        </GestureHandlerRootView>
    );
}