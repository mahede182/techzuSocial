import { useCallback } from 'react';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';
import { requestNotificationPermission, getFcmToken } from '@/utils/notifications';
import { saveFcmToken, removeFcmToken } from '@/api/auth';

export type NotificationData = {
    type?: string;
    postId?: string;
    [key: string]: string | undefined;
};

export const useNotifications = () => {
    const registerToken = useCallback(async (): Promise<string | null> => {
        const granted = await requestNotificationPermission();
        if (!granted) return null;

        const token = await getFcmToken();
        if (!token) return null;

        try {
            await saveFcmToken(token);
        } catch (error) {
            console.error('[useNotifications] saveFcmToken error:', error);
        }

        return token;
    }, []);


    const unregisterToken = useCallback(async (token: string | null) => {
        if (!token) return;
        try {
            await removeFcmToken(token);
        } catch (error) {
            console.error('[useNotifications] removeFcmToken error:', error);
        }
    }, []);

    const setupHandlers = useCallback(
        (onTap: (data: NotificationData) => void): (() => void) => {
            messaging().setBackgroundMessageHandler(async (_remoteMessage) => { });

            const unsubscribeForeground = messaging().onMessage(
                async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
                    Toast.show({
                        type: 'info',
                        text1: remoteMessage.notification?.title ?? 'New notification',
                        text2: remoteMessage.notification?.body ?? '',
                        visibilityTime: 4000,
                    });
                }
            );

            const unsubscribeBackground = messaging().onNotificationOpenedApp(
                (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
                    if (remoteMessage.data) {
                        onTap(remoteMessage.data as NotificationData);
                    }
                }
            );

            return () => {
                unsubscribeForeground();
                unsubscribeBackground();
            };
        },
        []
    );

    const checkInitialNotification = useCallback(
        async (onTap: (data: NotificationData) => void) => {
            const remoteMessage = await messaging().getInitialNotification();
            if (remoteMessage?.data) {
                onTap(remoteMessage.data as NotificationData);
            }
        },
        []
    );

    return { registerToken, unregisterToken, setupHandlers, checkInitialNotification };
};
